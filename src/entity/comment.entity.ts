import { Entity, ObjectIdColumn, Column } from 'typeorm';
import * as uuid from 'uuid'
import * as moment from 'moment'
import { Expose, plainToClass } from 'class-transformer'

@Entity('Comment')
export class ComemntEntity {
	@Expose()
	@ObjectIdColumn()
	_id: string

	@Expose()
	@Column()
	content: string

  @Expose()
	@Column()
	storyId: string

	@Expose()
	@Column()
	discussId: string

	@Expose()
	@Column()
	chapperId: string

	@Expose()
	@Column()
	createdAt: number

	@Expose()
	@Column()
	createBy: any

	@Expose()
	@Column()
	updatedAt: number

	constructor(args: Partial<ComemntEntity>) {
		if(args) {
			Object.assign(
				this,
				plainToClass(ComemntEntity, args, {
					excludeExtraneousValues: true
				})
			)
			this._id = uuid.v4()
			this.createdAt = this.createdAt || moment().valueOf()
			this.updatedAt = moment().valueOf()
		}
	}
}
