export interface IKakaoAuth {
  id: number;
  connected_at: Date;
  properties: Properties;
  kakao_account: KakaoAccount;
}

export interface KakaoAccount {
  profile_needs_agreement: boolean;
  profile: Profile;
  has_email: boolean;
  email_needs_agreement: boolean;
  is_email_valid: boolean;
  is_email_verified: boolean;
  email: string;
  has_gender: boolean;
  gender_needs_agreement: boolean;
  gender: string;
}

export interface Profile {
  nickname: string;
  thumbnail_image_url: string;
  profile_image_url: string;
}

export interface Properties {
  nickname: string;
  profile_image: string;
  thumbnail_image: string;
}

export interface IUser {
  userRoutes: IUserRoutes[];
  pickRoutes: IUserRoutes[];
  likeRoutes: IUserRoutes[];
}

export interface IUserRoutes {
  id: string;
  imageUrl: string;
  dateRange: string;
}
