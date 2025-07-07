declare namespace AuthApi {
  interface TokenInput {
    client_id?: string | null;
    client_secret?: string | null;
    grant_type?: string | null;
    scope?: string | null;
  }

  interface ErpTokenInput extends TokenInput {
    Version?: string | null;
    Intranet?: string | null;
    AppId?: string | null;
    ClientId?: string | null;
    Uuid?: string | null;
    Authorization?: string | null;
  }

  interface TokenError {
    error?: string | null;
    error_description?: Number | null;
    error_uri?: string | null;
  }

  interface TokenDto {
    access_token?: string | null;
    expires_in?: Number | null;
    token_type?: string | null;
    refresh_token?: string | null;
    creation_time?: string | Date | null;
  }
}
