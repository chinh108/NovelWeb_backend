import { getMongoRepository } from "typeorm"
import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { AppError } from 'common/error/AppError'
import { NotificationServiceService } from "notification/notification.service"
import { ChapperEntity, ComemntEntity, DiscussEntity, StoriesEntity } from "@entity"

@Injectable()
export class CommentService {
    constructor(private readonly notificationServiceService: NotificationServiceService) { }

  async getChapperById(_id: string) {
    try {
    } catch (error) {
      throw new HttpException(...AppError(error))
    }
  }

  async createComment(user: any, input: any) {
    try {
        if (!input?.content) {
            throw new HttpException("Content is empty", HttpStatus.BAD_REQUEST)
        }

        const newComment = new ComemntEntity({...input, createBy: user});
        const saveComment = await getMongoRepository(ComemntEntity).save(newComment);
        this.notificationServiceService.saveNotification(user?._id, saveComment).then(() => true)

        return saveComment;
    } catch (error) {
        throw new HttpException(...AppError(error))
    }
}

  async getComments(id: string, by: string) {
    try {
      const query = { [by]: id }
      const comments = await getMongoRepository(ComemntEntity).find({ where: query, order: { createBy: 'DESC' } })
      return comments;
    } catch (error) {
      throw new HttpException(...AppError(error))
    }
  }

  async getRecentlyComments() {
    try {
      const comments = await getMongoRepository(ComemntEntity).find({ order: { createBy: 'DESC' }, take: 5 })
      const data: any = [];
      for (const item of comments) {
        if (item.storyId) {
          const story = await getMongoRepository(StoriesEntity).findOne({ _id: item.storyId });
          (item as any).story = story
        }
        if (item.discussId) {
          const discuss = await getMongoRepository(DiscussEntity).findOne({ _id: item.discussId });
          (item as any).discuss = discuss
        }
        if (item.chapperId) {
          const chapper = await getMongoRepository(ChapperEntity).findOne({ _id: item.chapperId });
          (item as any).chapper = chapper
        }
        data.push(item)
      }

      return data;
    } catch (error) {
      throw new HttpException(...AppError(error))
    }
  }
}