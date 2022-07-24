import { Entity, ObjectIdColumn, Column } from 'typeorm';
import * as uuid from 'uuid'
import * as moment from 'moment'
import { Expose, plainToClass } from 'class-transformer'

@Entity('Story')
export class StoriesEntity {
	@Expose()
	@ObjectIdColumn()
	_id: string

	@Expose()
	@Column()
	title: string

	@Expose()
	@Column()
	altname: string[]

	@Expose()
	@Column()
	author: string

	@Expose()
	@Column()
	illustrator: string

	@Expose()
	@Column()
	type: number

	@Expose()
	@Column()
	genders: string[]

	@Expose()
	@Column()
	status: number

	@Expose()
	@Column()
	avatar: string

  @Expose()
	@Column()
	summary: string

  @Expose()
	@Column()
	extra: string

	@Expose()
	@Column()
	viewCount: number

	@Expose()
	@Column()
	group: string

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

	constructor(args: Partial<StoriesEntity>) {
		if(args) {
			Object.assign(
				this,
				plainToClass(StoriesEntity, args, {
					excludeExtraneousValues: true
				})
			)
			this._id = uuid.v4()
			this.createdAt = this.createdAt || moment().valueOf()
			this.group = this.group || 'Web truyện'
			this.updatedAt = moment().valueOf()
			this.isActive = true;
			this.viewCount = 0;
		}
	}
}
