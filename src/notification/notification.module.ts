import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {ChapperEntity, DiscussEntity, NotificationEntity, StoriesEntity} from '@entity'
import {NotificationController} from "./notification.controller";
import {NotificationServiceService} from "./notification.service";

@Module({
    imports: [TypeOrmModule.forFeature([NotificationEntity, StoriesEntity, DiscussEntity, ChapperEntity])],
    controllers: [NotificationController],
    providers: [NotificationServiceService],
    exports: [NotificationServiceService]
})
export class NotificationModule {}