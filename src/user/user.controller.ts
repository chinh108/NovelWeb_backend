import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common'
import { UserService } from './user.service'
import {ChangePasswordDTO, LoginDTO, LoginWithGoogleDTO, RegisterDTO} from '@utils'
import { AuthGuard, User, Reponse } from '@common'

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @UseGuards(AuthGuard)
  @Get('profile')
  async profile(@User() user) {
    const data = await this.userService.getUserById(user._id)
    return Reponse(data)
  }

  @Get()
  async userById(@Query('id') idUser) {
    const data = await this.userService.getUserById(idUser)
    return Reponse(data)
  }

  @Post('register')
  async register(@Body() registerData: RegisterDTO) {
    const data = await this.userService.register(registerData)
    return Reponse(data)
  }

  @Post('login')
  async login(@Body() loginDTO: LoginDTO) {
    const data = await this.userService.login(loginDTO)
    return Reponse(data)
  }

  @Post('login/google')
  async loginWithGoogle(@Body() loginWithGoogleDTO: LoginWithGoogleDTO) {
    const data = await this.userService.loginWithGoogle(loginWithGoogleDTO);
    return Reponse(data);
  }

  @UseGuards(AuthGuard)
  @Post('change-password')
  async changePassword(@User() user, @Body() input: ChangePasswordDTO) {
    const data = await this.userService.changePassword(user._id, input)
    return Reponse(data)
  }
}