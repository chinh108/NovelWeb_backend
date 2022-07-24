import { getMongoRepository } from "typeorm"
import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { ChapperEntity, StoriesEntity } from '@entity'
import { AppError } from 'common/error/AppError'
import * as moment from 'moment'
import { StoriesService } from "stories/stories.service"

@Injectable()
export class ChapperService {
  constructor(private readonly storiesService: StoriesService) { }
  async getChapperById(_id: string) {
    try {
      const chapper: any = await getMongoRepository(ChapperEntity).findOne({ _id })
      
      if (!chapper) {
        throw new HttpException('Chapper does not exist', HttpStatus.NOT_FOUND)
      }
      await this.storiesService.viewStory(chapper.storyId);
      const [next, pre] = await Promise.all([
        await getMongoRepository(ChapperEntity).findOne({ where: { createdAt: { $gt: chapper.createdAt } } }),
        await getMongoRepository(ChapperEntity).find({ where: { createdAt: { $lt: chapper.createdAt } }, order: { createdAt: 'DESC' }, take: 1 })
      ])
      const story = await getMongoRepository(StoriesEntity).findOne({ _id: chapper.storyId })
      chapper.story = story;
      chapper.nextChap = next?._id;
      chapper.preChap = pre?.[0]?._id;
      return chapper
    } catch (error) {
      throw new HttpException(...AppError(error))
    }
  }
  async createChapper(userId: string, input: any) {
    try {
      const story = await getMongoRepository(StoriesEntity).findOne({ _id: input.storyId })
      if (!story) {
        throw new HttpException('Story does not exist', HttpStatus.NOT_FOUND)
      }
      story.updatedAt = moment().valueOf();
      await getMongoRepository(StoriesEntity).save(story)
      const newChapper = new ChapperEntity({...input, createBy: userId });
      const chapper = await getMongoRepository(ChapperEntity).save(newChapper)
      return chapper
    } catch (error) {
      throw new HttpException(...AppError(error))
    }
  }
}