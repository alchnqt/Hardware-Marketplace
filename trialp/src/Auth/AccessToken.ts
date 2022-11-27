let accessToken: string = '';

const setAccessToken = (token: string): string => accessToken = token;

const getAccessToken = (): string => accessToken;

export interface AccessTokenService {
    setAccessToken(token: string): string,
    getAccessToken(): void
}

export const accessTokenService: AccessTokenService = {
    setAccessToken: setAccessToken,
    getAccessToken: getAccessToken
}

export default accessTokenService;