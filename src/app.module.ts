import {Module} from '@nestjs/common'
import {AppController} from './app.controller'
import {AppService} from './app.service'
import {UserModule} from './user/user.module'
import {TypeOrmModule} from '@nestjs/typeorm'
import {join} from 'path'
import {StoriesModule} from 'stories/stories.module'
import {ChapperModule} from 'chapper/chapper.module'
import {DiscussModule} from 'discuss/discuss.module'
import {CommentModule} from 'comment/comment.module'
import {NotificationModule} from "./notification/notification.module";

@Module({
    imports: [
        UserModule,
        StoriesModule,
        ChapperModule,
        DiscussModule,
        CommentModule,
        NotificationModule,
        TypeOrmModule.forRoot(
            {
                url: 'mongodb+srv://admin:abcd1234@bookwed-cluster.hy54g.mongodb.net/Admin_Novel_web',
                // url: 'mongodb://localhost:27017/eventmanage',
                type: "mongodb",
                entities: [join(__dirname, '**/**.entity{.ts,.js}')],
                synchronize: true,
                useNewUrlParser: true,
                logging: true,
                useUnifiedTopology: true
            }
        ),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
