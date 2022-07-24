import { Entity, ObjectIdColumn, Column } from 'typeorm';
import * as uuid from 'uuid'
import * as moment from 'moment'
import { Expose, plainToClass } from 'class-transformer'

@Entity('User')
export class UserEntity {
	@Expose()
	@ObjectIdColumn()
	_id: string

	@Expose()
	@Column()
	name: string

	@Expose()
	@Column()
	password: string

	@Expose()
	@Column()
	email: string

	@Expose()
	@Column()
	username: string

	@Expose()
	@Column()
	phoneNumber: string

	@Expose()
	@Column()
	avatar: string

	@Expose()
	@Column()
	createdAt: number

	@Expose()
	@Column()
	updatedAt: number

	constructor(args: Partial<UserEntity>) {
		if(args) {
			Object.assign(
				this,
				plainToClass(UserEntity, args, {
					excludeExtraneousValues: true
				})
			)
			this._id = uuid.v4()
			this.createdAt = this.createdAt || moment().valueOf()
			this.updatedAt = moment().valueOf()
		}
	}
}
