import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ChapperEntity, StoriesEntity } from '@entity'
import { StoriesService } from './stories.service'
import { StoriesController } from './stories.controller'

@Module({
    imports: [TypeOrmModule.forFeature([StoriesEntity, ChapperEntity])],
    controllers: [StoriesController],
    providers: [StoriesService],
    exports: [StoriesService]
})
export class StoriesModule { }