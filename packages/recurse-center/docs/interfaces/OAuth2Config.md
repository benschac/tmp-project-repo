[**Recurse Center API SDK**](../README.md) • **Docs**

***

[Recurse Center API SDK](../globals.md) / OAuth2Config

# Interface: OAuth2Config

Configuration for OAuth2 authentication and API settings.

## Properties

### apiBaseUrl

> **apiBaseUrl**: `string`

The base URL for API requests, typically 'https://www.recurse.com'

#### Defined in

types.ts:18

***

### authorizationEndpoint

> **authorizationEndpoint**: `string`

The endpoint for authorization, typically 'https://www.recurse.com/oauth/authorize'

#### Defined in

types.ts:12

***

### clientId

> **clientId**: `string`

The client ID provided by the Recurse Center for your application

#### Defined in

types.ts:6

***

### clientSecret

> **clientSecret**: `string`

The client secret provided by the Recurse Center for your application

#### Defined in

types.ts:8

***

### redirectUri

> **redirectUri**: `string`

The redirect URI registered with your application

#### Defined in

types.ts:10

***

### scope

> **scope**: `string`

The scopes requested for API access

#### Defined in

types.ts:16

***

### tokenEndpoint

> **tokenEndpoint**: `string`

The endpoint for token exchange and refresh, typically 'https://www.recurse.com/oauth/token'

#### Defined in

types.ts:14
