import { Controller, Get, Post, Body, UseGuards, Query, Delete } from '@nestjs/common'
import { StoriesService } from './stories.service'
import { AuthGuard, User, Reponse } from '@common'

@Controller('story')
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) { }

  @Get()
  async getStoryById(@Query('id') id) {
    const data = await this.storiesService.getStoryById(id)
    return Reponse(data)
  }

  @UseGuards(AuthGuard)
  @Get('byMe')
  async getAllOwnStory(@User() user) {
    const data = await this.storiesService.getOwnStories(user._id)
    return Reponse(data)
  }

  @UseGuards(AuthGuard)
  @Post()
  async createStory(@User() user, @Body() input: any) {
    const data = await this.storiesService.createStory(user._id, input)
    return Reponse(data)
  }

  @Get('all')
  async getAllStories() {
    const data = await this.storiesService.getAllStory()
    return Reponse(data)
  }

  @Get('search')
  async paginationStories(@Query() query) {
    const data = await this.storiesService.paginationStories(query)
    return Reponse(data)
  }

  @Get('viewStory')
  async viewStory(@Query('id') id) {
    const data = await this.storiesService.viewStory(id)
    return Reponse(data)
  }

  @Get('detailStory')
  async detailStory(@Query('id') id) {
    const data = await this.storiesService.detailStory(id)
    return Reponse(data)
  }

  @Get('otherStoriesByAuthor')
  async otherStoriesByAuthor(@Query('id') id) {
    const data = await this.storiesService.otherStoriesByAuthor(id)
    return Reponse(data)
  }

  @Delete()
  async deleteStory(@Query('id') id) {
    const data = await this.storiesService.deleteStory(id)
    return Reponse(data)
  }
}