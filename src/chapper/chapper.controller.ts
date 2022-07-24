import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common'
import { ChapperService } from './chapper.service'
import { AuthGuard, Reponse, User } from '@common'

@Controller('chapper')
export class ChapperController {
  constructor(private readonly chapperService: ChapperService) { }

  @Get()
  async chapperById(@Query('id') id) {
    const data = await this.chapperService.getChapperById(id)
    return Reponse(data)
  }

  @UseGuards(AuthGuard)
  @Post()
  async createChapper(@User() user, @Body() input: any) {
    const data = await this.chapperService.createChapper(user._id, input)
    return Reponse(data)
  }
}