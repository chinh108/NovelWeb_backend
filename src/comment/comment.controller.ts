import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common'
import { AuthGuard, Reponse, User } from '@common'
import { CommentService } from './comment.service'

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @Get()
  async chapperById(@Query('id') id) {
    const data = await this.commentService.getChapperById(id)
    return Reponse(data)
  }

  @UseGuards(AuthGuard)
  @Post()
  async createComment(@User() user, @Body() input: any) {
    const data = await this.commentService.createComment(user, input)
    return Reponse(data)
  }

  @Get('allBy')
  async getCommentByStory(@Query('id') id, @Query('by') by) {
    const data = await this.commentService.getComments(id, by)
    return Reponse(data)
  }

  @Get('recently')
  async commentRecent() {
    const data = await this.commentService.getRecentlyComments()
    return Reponse(data)
  }
}