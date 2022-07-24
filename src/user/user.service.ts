import * as jwt from 'jsonwebtoken'
import * as bcrypt from 'bcrypt'
import { getMongoRepository } from "typeorm"
import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import {ACCESS_TOKEN, RegisterDTO, LoginDTO, ChangePasswordDTO, LoginWithGoogleDTO} from '@utils'
import { UserEntity} from '@entity'
import { AppError } from 'common/error/AppError'
import axios from 'axios';

@Injectable()
export class UserService {

  async login(loginDTO: LoginDTO): Promise<any> {
    const { email, password } = loginDTO
    const userExist = await getMongoRepository(UserEntity).findOne({
      where: {
        $or: [ { email }, { username: email } ]
      }
    })
    if (!userExist) {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND)
    }
    if (userExist && (await bcrypt.compareSync(password, userExist.password))) {
      const token = jwt.sign(
        { userId: userExist._id },
        ACCESS_TOKEN,
        { expiresIn: '30d' }
      )
      return { "accessToken": token }
    }
    throw new HttpException('Wrong username or password!', HttpStatus.UNAUTHORIZED)
  }

  async loginWithGoogle(loginWithGoogleDTO: LoginWithGoogleDTO) {
    try {
      const { googleToken } = loginWithGoogleDTO;
      const { data: googleResponse } = await axios.get(
        'https://oauth2.googleapis.com/tokeninfo',
        {
          params: {
            id_token: googleToken,
          },
        },
      );

      if (!googleResponse?.email) {
        throw new HttpException(
          'Google authentication has error',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const { email,name,picture } = googleResponse;
      const userExist = await getMongoRepository(UserEntity).findOne({
        where: {
          email,
        },
      });

      let userId = userExist?._id;

      // save if new user
      if (!userExist) {
        const newUser = new UserEntity({
          username: email,
          email,
          avatar:picture,
          name
        });
        const saveUser = await getMongoRepository(UserEntity).save(newUser);

        if (!!saveUser) {
          userId = saveUser._id;
        }
      }

      if (!userId) {
        throw new HttpException(
          'Google authentication has error',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const token = jwt.sign({ userId }, ACCESS_TOKEN, { expiresIn: '30d' });
      return { accessToken: token };
    } catch (error) {
      throw new HttpException(...AppError(error));
    }
  }
  async register(registerDTO: RegisterDTO) {
    try {
      const { email } = registerDTO
      const userExist = await getMongoRepository(UserEntity).findOne({
        where: {
          $or: [ { email }, { username: email } ]
        }
      })
      if (userExist) throw new HttpException('User exist', HttpStatus.CONFLICT)
      const newUser = new UserEntity({
        ...registerDTO,
		    password: await bcrypt.hash(registerDTO.password, 10)
      })
      const saveUser = await getMongoRepository(UserEntity).save(newUser)
      return !!saveUser
    } catch (error) {
      throw new HttpException(...AppError(error))
    }
  }
  async getUserById(_id: string) {
    try {
      const user = await getMongoRepository(UserEntity).findOne({ _id })
      if (!user) {
        throw new HttpException('User does not exist', HttpStatus.NOT_FOUND)
      }
      delete user.password
      return user
    } catch (error) {
      throw new HttpException(...AppError(error))
    }
  }
  async changePassword(_id: string, input: ChangePasswordDTO) {
    try {
      const user = await getMongoRepository(UserEntity).findOne({ _id })
      if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND)
      if (!(await bcrypt.compare(input.currentPassword, user.password)))
      throw new HttpException('Current password is incorrect', HttpStatus.CONFLICT)
      user.password = await bcrypt.hash(input.newPassword, 10)
      const saveUser = await getMongoRepository(UserEntity).save(user)
      return !!saveUser
    } catch (error) {
      throw new HttpException(...AppError(error))
    }
  }
}