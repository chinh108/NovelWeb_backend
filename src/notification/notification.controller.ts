import {Controller, Get, UseGuards} from "@nestjs/common";
import {AuthGuard, Reponse, User} from "@common";
import {StoriesService} from "../stories/stories.service";
import {NotificationServiceService} from "./notification.service";

@Controller('notification')
export class NotificationController {
      constructor(private readonly notificationServiceService: NotificationServiceService) { }


  @UseGuards(AuthGuard)
  @Get()
  async getAllOwnStory(@User() user) {
    const data = await this.notificationServiceService.getNotification(user._id)
    return Reponse(data)
  }
}