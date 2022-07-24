export interface ByUser {
  _id: string
  name: string
}
export interface RegisterDTO {
  username: string
  password: string
  email: string
}
export interface LoginDTO {
  email: string
  password: string
}
export interface LoginWithGoogleDTO {
  googleToken: string
}

export interface UpdateUserDTO {
  name: string
  password: string
  phoneNumber: string
  idGroup: string
  avatar: string
  birthday: string
  role: string
  gender: EnumGender
}
export interface AddEventDTO {
  name: string
  idGroup: string
  idsUser: string[]
  description: string
  avatar: string
  date: number
  duration: number
}
export enum EnumEventState {
  COMPLETED = 'COMPLETED',
  PROCESSING = 'PROCESSING',
  CANCELLED = 'CANCELLED'
}
export interface GroupDTO {
  name: string
  avatar: string
  description: string
  title: string
  background: string
}
export interface FeedbackDTO {
  idEvent: string
	content: string
}

export enum EnumUserEventState {
  APPROVED = 'APPROVED',
  REQUESTED = 'REQUESTED',
  CANCELLED = 'CANCELLED'
}

export enum EnumGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  ORTHER = 'ORTHER'
}
export enum EnumUserEventVote {
  LIKE = 'LIKE',
  DISLIKE = 'DISLIKE',
  NONE = 'NONE'
}
export interface ChangePasswordDTO {
  currentPassword: string,
  newPassword: string
}
export interface ChangeProfile {
  name: string
  phoneNumber: string
  avatar: string
  birthday: string
  gender: EnumGender
}

export interface UpdateEventDTO {
  name: string
  idGroup: string
  description: string
  avatar: string
  date: number
  duration: number
}