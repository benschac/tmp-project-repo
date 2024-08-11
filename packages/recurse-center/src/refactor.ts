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

export { RecurseCenter, RecurseCenterError, Config }
export {
  ProfilesResponse,
  Batch,
  LocationsResponse,
  Person,
  HubVisit,
} from './types'
