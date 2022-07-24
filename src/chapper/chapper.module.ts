import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ChapperController } from './chapper.controller'
import { ChapperService } from './chapper.service'
import { StoriesEntity, ChapperEntity } from '@entity'
import { StoriesService } from 'stories/stories.service'

@Module({
    imports: [TypeOrmModule.forFeature([ChapperEntity, StoriesEntity])],
    controllers: [ChapperController],
    providers: [ChapperService, StoriesService],
    exports: [ChapperService]
})
export class ChapperModule { }