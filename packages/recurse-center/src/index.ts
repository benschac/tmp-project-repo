import ky from 'ky'

import {
  ProfilesResponse,
  Batch,
  LocationsResponse,
  OAuth2Config,
  TokenResponse,
} from './types'
import { APIError } from './error'
// export * from './types'

/**
 * OAuth2Client class for interacting with the Recurse Center API.
 * This client handles OAuth 2.0 authentication and provides methods for accessing various API endpoints.
 */
class RecurseCenter {
  private config: OAuth2Config
  private kyInstance: typeof ky
  private accessToken: string | null = null
  private refreshToken: string | null = null
  private tokenExpirationTime: number | null = null

  /**
   * Creates an instance of RecurseCenter.
   * @param {OAuth2Config} config - The configuration object for OAuth2 and API settings.
   */
  constructor(config: OAuth2Config) {
    this.config = { ...config, apiBaseUrl: 'https://www.recurse.com/' }
    this.kyInstance = ky.create({
      prefixUrl: config.apiBaseUrl,
      timeout: 30000, // 30 seconds timeout
    })
  }

  /**
   * Generates the authorization URL for the OAuth2 flow.
   * @returns {string} The authorization URL.
   */
  getAuthorizationUrl(): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: 'code',
      scope: this.config.scope,
    })

    return `${this.config.authorizationEndpoint}?${params.toString()}`
  }

  /**
   * Exchanges an authorization code for access and refresh tokens.
   *
   * @param {string} code - The authorization code received from the OAuth2 server.
   * @returns {Promise<void>}
   * @throws {APIError} If the token exchange fails.
   *
   * @remarks
   * This method uses the following parameters in the token request:
   *
   * - grant_type: Always 'authorization_code' for this request.
   * - code: The authorization code received after user authorization.
   * - redirect_uri: Must match the redirect URI in your app settings.
   * - client_id: Your app's client ID from https://www.recurse.com/settings/apps
   * - client_secret: Your app's client secret from https://www.recurse.com/settings/apps
   *
   * Ensure that your client ID, client secret, and redirect URI are correctly set
   * in your OAuth2Config when initializing the client.
   *
   * @see {@link https://www.recurse.com/settings/apps} for managing your app's OAuth settings.
   */
  async exchangeCodeForTokens(code: string): Promise<void> {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: this.config.redirectUri,
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
    })

    const response = await this.kyInstance
      .post(this.config.tokenEndpoint, {
        body: params,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      .json<TokenResponse>()

    this.setTokens(response)
  }

  /**
   * Refreshes the access token using the refresh token.
   * @returns {Promise<void>}
   * @throws {APIError} If the token refresh fails.
   */
  private async refreshAccessToken(): Promise<void> {
    if (!this.refreshToken) {
      throw new APIError(401, 'Unauthorized', 'No refresh token available')
    }

    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: this.refreshToken,
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
    })

    const response = await this.kyInstance
      .post(this.config.tokenEndpoint, {
        body: params,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      .json<TokenResponse>()

    this.setTokens(response)
  }

  /**
   * Sets the access and refresh tokens and calculates the expiration time.
   * @param {TokenResponse} tokenResponse - The response from the token endpoint.
   */
  private setTokens(tokenResponse: TokenResponse): void {
    this.accessToken = tokenResponse.access_token
    this.refreshToken = tokenResponse.refresh_token
    this.tokenExpirationTime = Date.now() + tokenResponse.expires_in * 1000
  }

  /**
   * Gets a valid access token, refreshing if necessary.
   * @returns {Promise<string>} A valid access token.
   */
  private async getValidAccessToken(): Promise<string> {
    if (
      !this.accessToken ||
      !this.tokenExpirationTime ||
      Date.now() >= this.tokenExpirationTime
    ) {
      await this.refreshAccessToken()
    }
    return this.accessToken!
  }

  /**
   * Handles API requests, including error handling and token refresh.
   * @param {Promise<T>} request - The API request to handle.
   * @returns {Promise<T>} The response from the API.
   * @throws {APIError} If the request fails.
   */
  // @ts-expect-error - TODO:
  private async handleRequest<T>(request: Promise<T>): Promise<T> {
    // ... (implementation remains the same)
  }
  /**
   * Retrieves profiles based on the provided query and role.
   *
   * @param {string} [query] - Optional. A search query to filter profiles. This can be used to search for names, interests, or other profile information.
   * @param {string} [role] - Optional. A specific role to filter profiles by. For example, 'faculty' or 'student'.
   * @returns {Promise<ProfilesResponse>} A promise that resolves to an array of profile objects matching the search criteria.
   * @throws {APIError} If the request fails or returns an error status.
   *
   * @example
   * // Fetch all profiles
   * const allProfiles = await client.getProfiles();
   *
   * @example
   * // Search for profiles with 'JavaScript' in their information
   * const jsProfiles = await client.getProfiles('JavaScript');
   *
   * @example
   * // Search for faculty profiles interested in 'machine learning'
   * const mlFacultyProfiles = await client.getProfiles('machine learning', 'faculty');
   *
   * @see {@link https://github.com/recursecenter/wiki/wiki/Recurse-Center-API#profiles} for more information on the profiles endpoint.
   */
  async getProfiles(query?: string, role?: string): Promise<ProfilesResponse> {
    const accessToken = await this.getValidAccessToken()

    const searchParams = new URLSearchParams()
    if (query) searchParams.set('query', query)
    if (role) searchParams.set('role', role)

    return this.handleRequest(
      this.kyInstance
        .get('api/v1/profiles', {
          searchParams,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .json<ProfilesResponse>()
    )
  }

  /**
   * Retrieves information about a specific batch.
   * @param {number} batchId - The ID of the batch to retrieve.
   * @returns {Promise<Batch>} Information about the requested batch.
   * @throws {APIError} If the request fails.
   */
  // @ts-expect-error - TODO:
  async getBatch(batchId: number): Promise<Batch> {
    // ... (implementation remains the same)
  }

  /**
   * Retrieves locations based on the provided query.
   * @param {string} query - The search query for locations.
   * @returns {Promise<LocationsResponse>} A list of locations matching the query.
   * @throws {APIError} If the request fails.
   */
  // @ts-expect-error - TODO:
  async getLocations(query: string): Promise<LocationsResponse> {
    // ... (implementation remains the same)
  }
}

export { RecurseCenter }
export {
  ProfilesResponse,
  Batch,
  LocationsResponse,
  OAuth2Config,
  TokenResponse,
} from './types'
