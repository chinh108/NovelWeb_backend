import {Column, Entity, ObjectIdColumn} from 'typeorm';
import * as uuid from 'uuid'
import * as moment from 'moment'
import {Expose, plainToClass} from 'class-transformer'

@Entity('Notification')
export class NotificationEntity {
    @Expose()
    @ObjectIdColumn()
    _id: string

    @Expose()
    @ObjectIdColumn()
    userId: string

    @Expose()
    @Column()
    content: string

    @Expose()
    @Column()
    forumId: string

    @Expose()
    @Column()
    url: string

    @Expose()
    @Column()
    createdAt: number

    @Expose()
    @Column()
    createBy: string

    @Expose()
    @Column()
    updatedAt: number

    constructor(args: Partial<NotificationEntity>) {
        if (args) {
            Object.assign(
                this,
                plainToClass(NotificationEntity, args, {
                    excludeExtraneousValues: true
                })
            )
            this._id = uuid.v4()
            this.createdAt = this.createdAt || moment().valueOf()
            this.updatedAt = moment().valueOf()
        }
    }
}
