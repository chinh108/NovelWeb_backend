import { Entity, ObjectIdColumn, Column } from 'typeorm';
import * as uuid from 'uuid'
import * as moment from 'moment'
import { Expose, plainToClass } from 'class-transformer'

@Entity('Discuss')
export class DiscussEntity {
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
	category: number

	@Expose()
	@Column()
	seriesId: string

	@Expose()
	@Column()
	viewCount: number

	@Expose()
	@Column()
	isActive: boolean

	@Expose()
	@Column()
	createdAt: number

	@Expose()
	@Column()
	createBy: string

	@Expose()
	@Column()
	updatedAt: number

	constructor(args: Partial<DiscussEntity>) {
		if(args) {
			Object.assign(
				this,
				plainToClass(DiscussEntity, args, {
					excludeExtraneousValues: true
				})
			)
			this._id = uuid.v4()
			this.createdAt = this.createdAt || moment().valueOf()
			this.viewCount = 0;
			this.isActive = true;
			this.updatedAt = moment().valueOf()
		}
	}
}
