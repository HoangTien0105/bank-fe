export interface Token{
    accessToken: string,
    refreshToken: string,
    tokenType: string,
    expiresIn: number,
    role: string
}

export interface ApiResponse<T> {
  message: string;
  statusCode: number;
  success: boolean;
  response?: T;
}

export interface LoginResponse extends ApiResponse<Token> {}

export interface LogoutResponse extends ApiResponse<void> {}
