import { Entity, ObjectIdColumn, Column } from 'typeorm';
import * as uuid from 'uuid'
import * as moment from 'moment'
import { Expose, plainToClass } from 'class-transformer'

@Entity('Chaper')
export class ChapperEntity {
	@Expose()
	@ObjectIdColumn()
	_id: string

	@Expose()
	@Column()
	title: string

	@Expose()
	@Column()
	content: string

  @Expose()
	@Column()
	storyId: string

	@Expose()
	@Column()
	createdAt: number

	@Expose()
	@Column()
	createBy: string

	@Expose()
	@Column()
	updatedAt: number

	constructor(args: Partial<ChapperEntity>) {
		if(args) {
			Object.assign(
				this,
				plainToClass(ChapperEntity, args, {
					excludeExtraneousValues: true
				})
			)
			this._id = uuid.v4()
			this.createdAt = this.createdAt || moment().valueOf()
			this.updatedAt = moment().valueOf()
		}
	}
}
