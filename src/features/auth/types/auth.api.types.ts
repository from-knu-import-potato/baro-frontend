export interface KakaoLoginResponse {
  accessToken: string;
  refreshToken: string;
  registered: boolean;
}

export interface CredentialLoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  name: string;
  inviteCode: string;
}

export interface CredentialAuthResponse {
  accessToken: string;
  refreshToken: string;
  isNewUser: boolean;
}
