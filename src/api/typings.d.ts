declare namespace API {
  type AvatarUploadDTO = {
    avatarUrl?: string
  }

  type BaseResponseAvatarUploadDTO_ = {
    code?: number
    data?: AvatarUploadDTO
    message?: string
  }

  type BaseResponseBoolean_ = {
    code?: number
    data?: boolean
    message?: string
  }

  type BaseResponseLoginUserInfoVO_ = {
    code?: number
    data?: LoginUserInfoVO
    message?: string
  }

  type BaseResponseLoginUserVO_ = {
    code?: number
    data?: LoginUserVO
    message?: string
  }

  type BaseResponseLong_ = {
    code?: number
    data?: number
    message?: string
  }

  type BaseResponsePageUserVO_ = {
    code?: number
    data?: PageUserVO_
    message?: string
  }

  type BaseResponseString_ = {
    code?: number
    data?: string
    message?: string
  }

  type BaseResponseUserVO_ = {
    code?: number
    data?: UserVO
    message?: string
  }

  type DeleteRequest = {
    id?: number
  }

  type getLoginUserInfoVOByIdUsingGETParams = {
    /** id */
    id?: number
  }

  type getUserVOByIdUsingGETParams = {
    /** id */
    id?: number
  }

  type LoginUserInfoVO = {
    email?: string
    gender?: number
    id?: number
    phone?: string
    userAvatar?: string
    userName?: string
    userProfile?: string
  }

  type LoginUserVO = {
    createTime?: string
    email?: string
    gender?: number
    id?: number
    phone?: string
    updateTime?: string
    userAccount?: string
    userAvatar?: string
    userName?: string
    userProfile?: string
    userRole?: string
    userStatus?: number
  }

  type PageUserVO_ = {
    current?: number
    pages?: number
    records?: UserVO[]
    size?: number
    total?: number
  }

  type UserAddRequest = {
    email?: string
    gender?: number
    phone?: string
    userAccount?: string
    userName?: string
    userPassword?: string
    userProfile?: string
    userRole?: string
  }

  type UserLoginRequest = {
    userAccount?: string
    userPassword?: string
  }

  type UserQueryRequest = {
    current?: number
    email?: string
    gender?: number
    id?: number
    pageSize?: number
    phone?: string
    sortField?: string
    sortOrder?: string
    userAccount?: string
    userName?: string
    userRole?: string
    userStatus?: number
  }

  type UserRegisterRequest = {
    checkPassword?: string
    userAccount?: string
    userPassword?: string
  }

  type UserUpdateByLoginUserRequest = {
    email?: string
    gender?: number
    id?: number
    phone?: string
    userAvatar?: string
    userName?: string
    userProfile?: string
  }

  type UserUpdateRequest = {
    email?: string
    gender?: number
    id?: number
    phone?: string
    userAvatar?: string
    userName?: string
    userProfile?: string
    userRole?: string
    userStatus?: number
  }

  type UserVO = {
    createTime?: string
    email?: string
    gender?: number
    id?: number
    phone?: string
    updateTime?: string
    userAccount?: string
    userAvatar?: string
    userName?: string
    userProfile?: string
    userRole?: string
    userStatus?: number
  }
}
