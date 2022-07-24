import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {AppError} from "../common/error/AppError";
import {ChapperEntity, DiscussEntity, NotificationEntity, StoriesEntity} from "@entity";
import {getMongoRepository} from "typeorm";

const TYPE_OF_COMMENTS = Object.freeze({
    STORY_ID: 'storyId',
    DISCUSS_ID: 'discussId',
    CHAPPER_ID: "chapperId"
})

const MAPPING_ENTITY = Object.freeze({
    [TYPE_OF_COMMENTS.STORY_ID]: StoriesEntity,
    [TYPE_OF_COMMENTS.DISCUSS_ID]: DiscussEntity,
    [TYPE_OF_COMMENTS.CHAPPER_ID]: ChapperEntity
})

const MAPPING_URL = Object.freeze({
    [TYPE_OF_COMMENTS.STORY_ID]: '/truyen/',
    [TYPE_OF_COMMENTS.DISCUSS_ID]: '/thao-luan/',
    [TYPE_OF_COMMENTS.CHAPPER_ID]: '/chap/'
})

@Injectable()
export class NotificationServiceService {
    async getNotification(userId) {
        return await getMongoRepository(NotificationEntity).find({
            where: {userId},
            take: 10,
            order: {['createdAt']: 'DESC'}
        })
    }

    async saveNotification(userId, payload) {
        try {

            const typeOfComment = Object.values(TYPE_OF_COMMENTS).reduce((acc, curr) => {
                const rs = payload[curr]
                return rs ? curr : acc
            }, '')


            if (!typeOfComment) {
                throw new HttpException("Can't save notification", HttpStatus.INTERNAL_SERVER_ERROR)
            }
            const forum:any = await getMongoRepository(MAPPING_ENTITY[typeOfComment]).findOne({
                _id: payload[typeOfComment]
            })

            const userHasForum = forum?.createBy

            const {content, createBy: userHasComment} = payload
            const newNotification = new NotificationEntity({
                userId: userHasForum,
                content,
                forumId: forum._id,
                url: MAPPING_URL[typeOfComment] + forum._id,
                createBy: userId
            })

            if (userHasComment?._id === userHasForum) {
                return newNotification
            }

            const notification = await getMongoRepository(NotificationEntity).save(newNotification)

            return notification

        } catch (e) {
            throw new HttpException(...AppError(e))
        }
    }
}