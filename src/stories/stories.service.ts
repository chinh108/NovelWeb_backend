import { getMongoRepository } from "typeorm"
import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { ChapperEntity, StoriesEntity } from '@entity'
import { AppError } from "common/error/AppError"

@Injectable()
export class StoriesService {

  async getOwnStories(userId: string) {
    try {
      const stories = await getMongoRepository(StoriesEntity).find({
        where: {
          createBy: userId,
          isActive: { $ne: false }
        }
      })
      return stories
    } catch (error) {
      throw new HttpException(...AppError(error))
    }
  }
  async createStory(userId: string, input: any) {
    try {
      const newStory = new StoriesEntity({...input, createBy: userId });
      const story = await getMongoRepository(StoriesEntity).save(newStory)
      return story
    } catch (error) {
      throw new HttpException(...AppError(error))
    }
  }
  async getStoryById(_id: string) {
    try {
      const story = await getMongoRepository(StoriesEntity).findOne({ _id })
      if (!story) {
        throw new HttpException('Story does not exist', HttpStatus.NOT_FOUND)
      }
      return story
    } catch (error) {
      throw new HttpException(...AppError(error))
    }
  }
  async getAllStory() {
    try {
      const stories = await getMongoRepository(StoriesEntity).find({ where: { isActive: { $ne: false } } })
      return stories
    } catch (error) {
      throw new HttpException(...AppError(error))
    }
  }
  async paginationStories(filter: any) {
    try {
      filter.page = Number(filter.page || '1');
      const { search, type, status, genders, sort, page = 1, perPage } = filter;
      const take = Number(perPage) || 20
      const skip = (page - 1) * take;
      let order = {};
      const query: any = {
        type: { $in: type.map(item => Number(item)) },
        status: { $in: status.map(item => Number(item)) },
        isActive: { $ne: false }
      }
      if (search) {
        query.title = { $regex: search, $options: 'si' }
      }
      if (genders) {
        query.genders = { $in: [Number(genders)] } 
      }

      if (sort !== 'updatedAt' && sort !== 'createdAt' && sort !== 'viewCount') {
        order = { title: sort }
      } else {
        order = { [sort]: 'DESC' }
      }

      const [stories, count] = await getMongoRepository(StoriesEntity).findAndCount({
        where: query,
        order,
        take,
        skip
      })

      for (const item of (stories as any)) {
        const chapperStory = await getMongoRepository(ChapperEntity).find({ where: { storyId: item._id }, order: { createdAt: 'DESC' }, take: 1 })
        item.chapper = chapperStory?.[0];
      }

      const total = await getMongoRepository(StoriesEntity).count(query);
      return {
        stories,
        pagination: {
          count,
          totalPage: Math.ceil(total / take),
          currentPage: page,
          perPage: take,
          hasNextPage: total - take * (page - 1) > 0
        }
      }
    } catch (error) {
      throw new HttpException(...AppError(error))
    }
  }
  async viewStory(_id: string) {
    try {
      const story = await getMongoRepository(StoriesEntity).findOne({ _id })
      if (!story) {
        throw new HttpException('Story does not exist', HttpStatus.NOT_FOUND)
      }

      story.viewCount ++;
      const saveStory = await getMongoRepository(StoriesEntity).save(story)
      return saveStory
    } catch (error) {
      throw new HttpException(...AppError(error))
    }
  }

  async detailStory(_id: string) {
    try {
      const [story]: any[] = await getMongoRepository(StoriesEntity).aggregate([
        {
          $match: {
            _id,
            isActive: { $ne: false }
          }
        },
        {
          $lookup: {
            from: 'User',
            localField: 'createBy',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $unwind: "$user"
        },
        {
          $project: {
            "_id": 1,
            "title": 1,
            "altname": 1,
            "author": 1,
            "illustrator": 1,
            "type": 1,
            "avatar": 1,
            "group": 1,
            "genders": 1,
            "summary": 1,
            "extra": 1,
            "status": 1,
            "category": 1,
            "viewCount": 1,
            "createdAt": 1,
            "updatedAt": 1,
            "user._id": 1,
            "user.username": 1,
            "user.name": 1,
          }
        },
        {
          $sort: { createdAt: -1 }
        }
      ]).toArray()
      if (!story) {
        throw new HttpException('Story does not exist', HttpStatus.NOT_FOUND)
      }
      const chappers = await getMongoRepository(ChapperEntity).find({ storyId: _id })
      story.chappers = chappers;

      return story;
    } catch (error) {
      throw new HttpException(...AppError(error))
    }
  }

  async otherStoriesByAuthor(_id: string) {
    try {
      const story = await getMongoRepository(StoriesEntity).findOne({ _id })
      if (!story) {
        throw new HttpException('Story does not exist', HttpStatus.NOT_FOUND)
      }
      const otherStories = await getMongoRepository(StoriesEntity).find({
        where: {
          group: story.group,
          _id: { $ne: _id },
          isActive: { $ne: false }
        }
      })

      return otherStories
    } catch (error) {
      throw new HttpException(...AppError(error))
    }
  }
  async deleteStory(_id: string) {
    try {
      const story = await getMongoRepository(StoriesEntity).findOneAndUpdate({ _id }, { $set: { isActive: false } })
      return story.ok
    } catch (error) {
      throw new HttpException(...AppError(error))
    }
  }
}