// import ky from 'ky'

// import {
//   ProfilesResponse,
//   Batch,
//   LocationsResponse,
//   OAuth2Config,
//   TokenResponse,
// } from './types'
// import { APIError } from './error'

// function generateRandomState(): string {
//   return (
//     Math.random().toString(36).substring(2, 15) +
//     Math.random().toString(36).substring(2, 15)
//   )
// }
// /**
//  * OAuth2Client class for interacting with the Recurse Center API.
//  * This client handles OAuth 2.0 authentication and provides methods for accessing various API endpoints.
//  */
// class RecurseCenter {
//   private config: OAuth2Config
//   private kyInstance: typeof ky
//   private accessToken: string | null = null
//   private refreshToken: string | null = null
//   private tokenExpirationTime: number | null = null

//   /**
//    * Creates an instance of RecurseCenter.
//    * @param {OAuth2Config} config - The configuration object for OAuth2 and API settings.
//    */
//   constructor(config: OAuth2Config) {
//     this.config = { ...config, apiBaseUrl: 'https://www.recurse.com/' }
//     // this.kyInstance = ky.create({
//     //   prefixUrl: config.apiBaseUrl,
//     //   timeout: 30000, // 30 seconds timeout
//     // })
//     this.kyInstance = ky.create({
//       prefixUrl: this.config.apiBaseUrl,
//       timeout: 30000,
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//       mode: 'cors',
//       credentials: 'include',
//     })
//   }

//   /**
//    * Generates the authorization URL for the OAuth2 flow.
//    * @returns {string} The authorization URL.
//    */
//   getAuthorizationUrl(): string {
//     const params = new URLSearchParams({
//       client_id: this.config.clientId,
//       redirect_uri: this.config.redirectUri,
//       response_type: 'code',
//       scope: this.config.scope,
//       state: generateRandomState(), // Implement this function to generate a random string
//     })

//     return `${this.config.authorizationEndpoint}?${params.toString()}`
//   }

//   /**
//    * Exchanges an authorization code for access and refresh tokens.
//    *
//    * @param {string} code - The authorization code received from the OAuth2 server.
//    * @returns {Promise<TokenResponse>}
//    * @throws {APIError} If the token exchange fails.
//    *
//    * @remarks
//    * IMPORTANT: This method must only be called server-side. It should never be executed in a browser environment
//    * as it requires the client secret, which must be kept secure.
//    *
//    * This method uses the following parameters in the token request:
//    *
//    * - grant_type: Always 'authorization_code' for this request.
//    * - code: The authorization code received after user authorization.
//    * - redirect_uri: Must match the redirect URI in your app settings.
//    * - client_id: Your app's client ID from https://www.recurse.com/settings/apps
//    * - client_secret: Your app's client secret from https://www.recurse.com/settings/apps
//    *
//    * Ensure that your client ID, client secret, and redirect URI are correctly set
//    * in your OAuth2Config when initializing the client.
//    *
//    * For client-side applications, implement this exchange in a server-side API route or endpoint.
//    *
//    * @see {@link https://www.recurse.com/settings/apps} for managing your app's OAuth settings.
//    */
//   async exchangeCodeForTokens(code: string): Promise<TokenResponse> {
//     const params = new URLSearchParams({
//       grant_type: 'authorization_code',
//       code,
//       redirect_uri: this.config.redirectUri,
//       client_id: this.config.clientId,
//       client_secret: this.config.clientSecret,
//     })

//     try {
//       const response = await this.kyInstance
//         .post('oauth/token', {
//           body: params,
//         })
//         .json<TokenResponse>()

//       // this.setTokens(response)
//       return response
//     } catch (error) {
//       if (error instanceof Error) {
//         throw new APIError(500, 'Internal Server Error', error.message)
//       }
//       throw error
//     }
//   }

//   /**
//    * Refreshes the access token using the refresh token.
//    * @returns {Promise<void>}
//    * @throws {APIError} If the token refresh fails.
//    */
//   private async refreshAccessToken(): Promise<void> {
//     if (!this.refreshToken) {
//       throw new APIError(401, 'Unauthorized', 'No refresh token available')
//     }

//     const params = new URLSearchParams({
//       grant_type: 'refresh_token',
//       refresh_token: this.refreshToken,
//       client_id: this.config.clientId,
//       client_secret: this.config.clientSecret,
//     })

//     try {
//       const response = await this.kyInstance
//         .post('oauth/token', {
//           body: params,
//         })
//         .json<TokenResponse>()

//       this.setTokens(response)
//     } catch (error) {
//       if (error instanceof Error) {
//         throw new APIError(500, 'Internal Server Error', error.message)
//       }
//       throw error
//     }
//   }

//   /**
//    * Sets the access and refresh tokens and calculates the expiration time.
//    * @param {TokenResponse} tokenResponse - The response from the token endpoint.
//    */
//   public setTokens(tokenResponse: TokenResponse): void {
//     this.accessToken = tokenResponse.access_token
//     this.refreshToken = tokenResponse.refresh_token
//     this.tokenExpirationTime = Date.now() + tokenResponse.expires_in * 1000
//   }

//   /**
//    * Gets a valid access token, refreshing if necessary.
//    * @returns {Promise<string>} A valid access token.
//    */
//   private async getValidAccessToken(): Promise<string> {
//     if (
//       !this.accessToken ||
//       !this.tokenExpirationTime ||
//       Date.now() >= this.tokenExpirationTime
//     ) {
//       await this.refreshAccessToken()
//     }
//     return this.accessToken!
//   }

//   /**
//    * Handles API requests, including error handling and token refresh.
//    * @param {Promise<T>} request - The API request to handle.
//    * @returns {Promise<T>} The response from the API.
//    * @throws {APIError} If the request fails.
//    */
//   // @ts-expect-error - TODO:
//   private async handleRequest<T>(request: Promise<T>): Promise<T> {
//     // ... (implementation remains the same)
//   }
//   /**
//    * Retrieves profiles based on the provided query and role.
//    *
//    * @param {string} [query] - Optional. A search query to filter profiles. This can be used to search for names, interests, or other profile information.
//    * @param {string} [role] - Optional. A specific role to filter profiles by. For example, 'faculty' or 'student'.
//    * @returns {Promise<ProfilesResponse>} A promise that resolves to an array of profile objects matching the search criteria.
//    * @throws {APIError} If the request fails or returns an error status.
//    *
//    * @example
//    * // Fetch all profiles
//    * const allProfiles = await client.getProfiles();
//    *
//    * @example
//    * // Search for profiles with 'JavaScript' in their information
//    * const jsProfiles = await client.getProfiles('JavaScript');
//    *
//    * @example
//    * // Search for faculty profiles interested in 'machine learning'
//    * const mlFacultyProfiles = await client.getProfiles('machine learning', 'faculty');
//    *
//    * @see {@link https://github.com/recursecenter/wiki/wiki/Recurse-Center-API#profiles} for more information on the profiles endpoint.
//    */
//   async getProfiles(props: {
//     query?: string
//     role?: string
//     token: string
//   }): Promise<ProfilesResponse> {
//     props.token
//     const accessToken = await this.getValidAccessToken()

//     const searchParams = new URLSearchParams()
//     if (props.query) searchParams.set('query', props.query)
//     if (props.role) searchParams.set('role', props.role)

//     return this.handleRequest(
//       this.kyInstance
//         .get('api/v1/profiles', {
//           searchParams,
//           headers: {
//             Authorization: `Bearer ${props.token}`,
//           },
//         })
//         .json<ProfilesResponse>()
//     )
//   }

//   /**
//    * Retrieves information about a specific batch.
//    * @param {number} batchId - The ID of the batch to retrieve.
//    * @returns {Promise<Batch>} Information about the requested batch.
//    * @throws {APIError} If the request fails.
//    */
//   // @ts-expect-error - TODO:
//   async getBatch(batchId: number): Promise<Batch> {
//     // ... (implementation remains the same)
//   }

//   /**
//    * Retrieves locations based on the provided query.
//    * @param {string} query - The search query for locations.
//    * @returns {Promise<LocationsResponse>} A list of locations matching the query.
//    * @throws {APIError} If the request fails.
//    */
//   // @ts-expect-error - TODO:
//   async getLocations(query: string): Promise<LocationsResponse> {
//     // ... (implementation remains the same)
//   }
// }

import ky from 'ky'
import {
  ProfilesResponse,
  Batch,
  LocationsResponse,
  Person,
  HubVisit,
} from './types'

/**
 * Configuration options for the RecurseCenter SDK.
 */
interface Config {
  /** The base URL for the API */
  baseUrl: string
  /** Optional timeout in milliseconds */
  timeout?: number
}

/**
 * Custom error class for API-related errors.
 */
class RecurseCenterError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message)
    this.name = 'RecurseCenterError'
  }
}

/**
 * RecurseCenter class for interacting with the Recurse Center API through an authenticated backend.
 * This client provides methods for accessing various API endpoints.
 */
class RecurseCenter {
  private kyInstance: typeof ky

  /**
   * Creates an instance of RecurseCenter.
   * @param {Config} config - The configuration object for API settings.
   */
  constructor(config: Config) {
    this.kyInstance = ky.create({
      prefixUrl: config.baseUrl,
      timeout: config.timeout || 30000,
      credentials: 'include',
      hooks: {
        beforeError: [
          (error) => {
            const { response } = error
            if (response && response.body) {
              const body = JSON.parse(response.body as any)
              throw new RecurseCenterError(
                response.status,
                body.message || 'Unknown error'
              )
            }
            return error
          },
        ],
      },
    })
  }

  /**
   * Get the authentication status of the current user.
   * @returns {Promise<{ authenticated: boolean, user?: Person }>}
   * @throws {RecurseCenterError}
   */
  async authStatus(): Promise<{ authenticated: boolean; user?: Person }> {
    try {
      return await this.kyInstance.get('auth-status').json()
    } catch (error) {
      if (error instanceof RecurseCenterError) throw error
      throw new RecurseCenterError(500, 'Failed to fetch auth status')
    }
  }

  /**
   * Get information about a specific batch or list all batches.
   * @param {number} [id] - Optional batch ID. If not provided, lists all batches.
   * @returns {Promise<Batch | Batch[]>}
   * @throws {RecurseCenterError}
   */
  async batches(id?: number): Promise<Batch | Batch[]> {
    const endpoint = id ? `batches/${id}` : 'batches'
    try {
      return await this.kyInstance.get(endpoint).json<Batch | Batch[]>()
    } catch (error) {
      if (error instanceof RecurseCenterError) throw error
      throw new RecurseCenterError(
        500,
        `Failed to fetch batch${id ? '' : 'es'}`
      )
    }
  }

  /**
   * Get, create, update, or delete hub visits.
   * @param {Object} params - Parameters for hub visits operations.
   * @param {('GET'|'POST'|'PATCH'|'DELETE')} params.method - The HTTP method to use.
   * @param {number} [params.personId] - The ID of the person for the hub visit.
   * @param {string} [params.date] - The date of the hub visit (YYYY-MM-DD).
   * @param {string} [params.notes] - Notes for the hub visit.
   * @param {Object} [params.appData] - Application-specific data for the hub visit.
   * @returns {Promise<HubVisit | HubVisit[]>}
   * @throws {RecurseCenterError}
   */
  async hubVisits(params: {
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE'
    personId?: number
    date?: string
    notes?: string
    appData?: Record<string, any>
  }): Promise<HubVisit | HubVisit[]> {
    const { method, personId, date, ...data } = params
    const endpoint =
      personId && date ? `hub_visits/${personId}/${date}` : 'hub_visits'

    const searchParams = new URLSearchParams()
    if (method === 'GET') {
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, String(value))
      })
    }

    try {
      return await this.kyInstance(endpoint, {
        method,
        searchParams: method === 'GET' ? searchParams : undefined,
        json: method !== 'GET' ? data : undefined,
      }).json<HubVisit | HubVisit[]>()
    } catch (error) {
      if (error instanceof RecurseCenterError) throw error
      throw new RecurseCenterError(500, 'Failed to perform hub visit operation')
    }
  }

  /**
   * Search for locations.
   * @param {string} query - Search query for locations.
   * @param {number} [limit] - Number of results to return (default 10, max 50).
   * @returns {Promise<LocationsResponse>}
   * @throws {RecurseCenterError}
   */
  async locations(query: string, limit?: number): Promise<LocationsResponse> {
    const searchParams = new URLSearchParams({ query })
    if (limit !== undefined) searchParams.append('limit', String(limit))

    try {
      return await this.kyInstance
        .get('locations', { searchParams })
        .json<LocationsResponse>()
    } catch (error) {
      if (error instanceof RecurseCenterError) throw error
      throw new RecurseCenterError(500, 'Failed to search locations')
    }
  }

  /**
   * Get the current user's profile.
   * @returns {Promise<ProfilesResponse>}
   * @throws {RecurseCenterError}
   */
  async me(): Promise<ProfilesResponse> {
    try {
      return await this.kyInstance.get('profiles/me').json<ProfilesResponse>()
    } catch (error) {
      if (error instanceof RecurseCenterError) throw error
      throw new RecurseCenterError(500, 'Failed to fetch user profile')
    }
  }

  /**
   * Search for profiles.
   * @param {Object} params - Search parameters.
   * @param {string} [params.query] - Search query string.
   * @param {number} [params.batch_id] - Filter by batch ID.
   * @param {number} [params.location_id] - Filter by location ID.
   * @param {('recurser'|'resident'|'facilitator'|'faculty')} [params.role] - Filter by role.
   * @param {('current'|'overlap')} [params.scope] - Scope of the search.
   * @param {number} [params.limit] - Number of results to return (default 20, max 50).
   * @param {number} [params.offset] - Offset for pagination.
   * @returns {Promise<ProfilesResponse>}
   * @throws {RecurseCenterError}
   */
  async profiles(params: {
    query?: string
    batch_id?: number
    location_id?: number
    role?: 'recurser' | 'resident' | 'facilitator' | 'faculty'
    scope?: 'current' | 'overlap'
    limit?: number
    offset?: number
  }): Promise<ProfilesResponse> {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) searchParams.append(key, String(value))
    })

    try {
      return await this.kyInstance
        .get('profiles', { searchParams })
        .json<ProfilesResponse>()
    } catch (error) {
      if (error instanceof RecurseCenterError) throw error
      throw new RecurseCenterError(500, 'Failed to search profiles')
    }
  }

  /**
   * Search for people.
   * @param {string} query - Search query for people.
   * @returns {Promise<Person[]>}
   * @throws {RecurseCenterError}
   */
  async searchPeople(query: string): Promise<Person[]> {
    const searchParams = new URLSearchParams({ q: query })
    try {
      return await this.kyInstance
        .get('people/search', { searchParams })
        .json<Person[]>()
    } catch (error) {
      if (error instanceof RecurseCenterError) throw error
      throw new RecurseCenterError(500, 'Failed to search people')
    }
  }
}

export { RecurseCenterError, Config }
export { Person, HubVisit } from './types'

export { RecurseCenter }
export {
  ProfilesResponse,
  Batch,
  LocationsResponse,
  OAuth2Config,
  TokenResponse,
} from './types'
