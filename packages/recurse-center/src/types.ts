/**
 * Configuration for OAuth2 authentication and API settings.
 */
export interface OAuth2Config {
  /** The client ID provided by the Recurse Center for your application */
  clientId: string
  /** The client secret provided by the Recurse Center for your application */
  clientSecret: string
  /** The redirect URI registered with your application */
  redirectUri: string
  /** The endpoint for authorization, typically 'https://www.recurse.com/oauth/authorize' */
  authorizationEndpoint: string
  /** The endpoint for token exchange and refresh, typically 'https://www.recurse.com/oauth/token' */
  tokenEndpoint: string
  /** The scopes requested for API access */
  scope: string
  /** The base URL for API requests, typically 'https://www.recurse.com' */
  apiBaseUrl: string | undefined
}

/**
 * Response from the token endpoint after successful authentication or token refresh.
 */
export interface TokenResponse {
  /** The access token for making authenticated API requests */
  access_token: string
  /** The refresh token for obtaining a new access token */
  refresh_token: string
  /** The number of seconds until the access token expires */
  expires_in: number
  /** The type of token, typically 'Bearer' */
  token_type: string
}

/**
 * Represents a user's current location.
 */
export interface CurrentLocation {
  /** Unique identifier for the location */
  id: number
  /** Full name of the location */
  name: string
  /** Abbreviated name of the location */
  short_name: string
}

/**
 * Represents a period of time a user spent at the Recurse Center or in employment.
 */
export interface Stint {
  /** Unique identifier for the stint */
  id: number
  /** Type of stint (e.g., 'retreat' or 'employment') */
  type: string
  /** Title or role during the stint */
  title: string | null
  /** Indicates if the stint was for a half batch */
  for_half_batch: boolean
  /** Indicates if the stint is currently in progress */
  in_progress: boolean
  /** Start date of the stint */
  start_date: string
  /** End date of the stint */
  end_date: string
  /** Information about the batch, if applicable */
  batch?: {
    /** Unique identifier for the batch */
    id: number
    /** Full name of the batch */
    name: string
    /** Short name of the batch */
    short_name: string
    /** Alternative name of the batch */
    alt_name: string
  }
}

/**
 * Represents a company associated with a user.
 */
export interface Company {
  /** Unique identifier for the company */
  id: number
  /** Name of the company */
  name: string
}

/**
 * Represents a user profile in the Recurse Center API.
 */
export interface Profile {
  /** Unique identifier for the user */
  id: number
  /** User's first name */
  first_name: string
  /** User's last name */
  last_name: string
  /** User's full name */
  name: string
  /** User's name with highlighted search terms */
  name_hl: string
  /** User's email address */
  email: string
  /** User's GitHub username */
  github: string
  /** User's role at their employer, if applicable */
  employer_role: string | null
  /** User's Twitter handle */
  twitter: string
  /** User's preferred pronouns */
  pronouns: string
  /** User's phone number without formatting */
  unformatted_phone_number: string
  /** User's Zoom meeting URL */
  zoom_url: string
  /** User's Zulip ID */
  zulip_id: number
  /** Path to the user's profile image */
  image_path: string
  /** User's formatted phone number */
  phone_number: string
  /** Unique slug for the user's profile */
  slug: string
  /** User's username on Joy of Computing */
  joy_of_computing_username: string
  /** Number of search results returned */
  results_count: number
  /** User's rendered biography */
  bio_rendered: string
  /** Indicates if the biography matched search terms */
  bio_match: boolean
  /** User's biography with highlighted search terms */
  bio_hl: string
  /** Truncated version of the user's biography */
  bio_truncated: string
  /** User's rendered pre-RC experience */
  before_rc_rendered: string
  /** Indicates if the pre-RC experience matched search terms */
  before_rc_match: boolean
  /** User's pre-RC experience with highlighted search terms */
  before_rc_hl: string
  /** Truncated version of the user's pre-RC experience */
  before_rc_truncated: string
  /** User's rendered RC experience */
  during_rc_rendered: string
  /** Indicates if the RC experience matched search terms */
  during_rc_match: boolean
  /** User's RC experience with highlighted search terms */
  during_rc_hl: string
  /** Truncated version of the user's RC experience */
  during_rc_truncated: string
  /** User's rendered interests */
  interests_rendered: string
  /** Indicates if the interests matched search terms */
  interests_match: boolean
  /** User's interests with highlighted search terms */
  interests_hl: string
  /** Truncated version of the user's interests */
  interests_truncated: string
  /** User's rendered employer information */
  employer_info_rendered: string
  /** Indicates if the employer information matched search terms */
  employer_info_match: boolean
  /** User's employer information with highlighted search terms */
  employer_info_hl: string
  /** Truncated version of the user's employer information */
  employer_info_truncated: string
  /** User's rendered GitHub information */
  github_rendered: string
  /** Indicates if the GitHub information matched search terms */
  github_match: boolean
  /** User's GitHub information with highlighted search terms */
  github_hl: string
  /** Truncated version of the user's GitHub information */
  github_truncated: string
  /** User's rendered phone number */
  phone_number_rendered: string
  /** Indicates if the phone number matched search terms */
  phone_number_match: boolean
  /** User's phone number with highlighted search terms */
  phone_number_hl: string
  /** Truncated version of the user's phone number */
  phone_number_truncated: string
  /** User's rendered email address */
  email_rendered: string
  /** Indicates if the email address matched search terms */
  email_match: boolean
  /** User's email address with highlighted search terms */
  email_hl: string
  /** Truncated version of the user's email address */
  email_truncated: string
  /** User's current location */
  current_location: CurrentLocation
  /** Array of user's stints at RC or in employment */
  stints: Stint[]
  /** User's associated company, if applicable */
  company: Company
}

/**
 * Represents the response from the profiles endpoint.
 */
export type ProfilesResponse = Profile[]

/**
 * Represents a batch at the Recurse Center.
 */
export interface Batch {
  /** Unique identifier for the batch */
  id: number
  /** Name of the batch */
  name: string
  /** Start date of the batch */
  start_date: string
  /** End date of the batch */
  end_date: string
}

/**
 * Represents a location in the Recurse Center API.
 */
export interface Location {
  /** Unique identifier for the location */
  id: number
  /** Full name of the location */
  name: string
  /** ASCII-friendly version of the location name */
  ascii_name: string
  /** Abbreviated name of the location */
  short_name: string
  /** Type of the location (e.g., 'city') */
  type: string
}

/**
 * Represents the response from the locations endpoint.
 */
export type LocationsResponse = Location[]
