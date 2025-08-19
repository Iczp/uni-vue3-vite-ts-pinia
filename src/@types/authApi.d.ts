declare namespace AuthApi {
  interface TokenInput {
    client_id?: string | null;
    client_secret?: string | null;
    grant_type?: string | null;
    scope?: string | null;
    [key: string]: any;
  }

  interface ErpTokenInput extends TokenInput {
    Version?: string | null;
    Intranet?: string | null;
    AppId?: string | null;
    ClientId?: string | null;
    Uuid?: string | null;
    Authorization?: string | null;
    [key: string]: any;
  }

  interface TokenError {
    error?: string | null;
    error_description?: Number | null;
    error_uri?: string | null;
    [key: string]: any;
  }

  interface TokenDto {
    access_token?: string | null;
    expires_in?: Number | null;
    token_type?: string | null;
    refresh_token?: string | null;
    creation_time?: string | Date | null;
    [key: string]: any;
  }

  interface UserInfo {
    email?: string | null;
    email_verified?: boolean | null;
    family_name?: string | null;
    given_name?: string | null;
    phone_number?: string | null;
    phone_number_verified?: boolean | null;
    preferred_username?: string | null;
    role?: string[] | null;
    sub?: string | null;
    tenantid?: string | null;
    [key: string]: any;
  }
}
