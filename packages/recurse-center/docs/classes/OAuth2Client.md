[**Recurse Center API SDK**](../README.md) • **Docs**

***

[Recurse Center API SDK](../globals.md) / OAuth2Client

# Class: OAuth2Client

OAuth2Client class for interacting with the Recurse Center API.
This client handles OAuth 2.0 authentication and provides methods for accessing various API endpoints.

## Constructors

### new OAuth2Client()

> **new OAuth2Client**(`config`): [`OAuth2Client`](OAuth2Client.md)

Creates an instance of OAuth2Client.

#### Parameters

• **config**: [`OAuth2Config`](../interfaces/OAuth2Config.md)

The configuration object for OAuth2 and API settings.

#### Returns

[`OAuth2Client`](OAuth2Client.md)

#### Defined in

index.ts:28

## Methods

### exchangeCodeForTokens()

> **exchangeCodeForTokens**(`code`): `Promise`\<`void`\>

Exchanges an authorization code for access and refresh tokens.

#### Parameters

• **code**: `string`

The authorization code received from the OAuth2 server.

#### Returns

`Promise`\<`void`\>

#### Throws

If the token exchange fails.

#### Defined in

index.ts:57

***

### getAuthorizationUrl()

> **getAuthorizationUrl**(): `string`

Generates the authorization URL for the OAuth2 flow.

#### Returns

`string`

The authorization URL.

#### Defined in

index.ts:40

***

### getBatch()

> **getBatch**(`batchId`): `Promise`\<`Batch`\>

Retrieves information about a specific batch.

#### Parameters

• **batchId**: `number`

The ID of the batch to retrieve.

#### Returns

`Promise`\<`Batch`\>

Information about the requested batch.

#### Throws

If the request fails.

#### Defined in

index.ts:158

***

### getLocations()

> **getLocations**(`query`): `Promise`\<`LocationsResponse`\>

Retrieves locations based on the provided query.

#### Parameters

• **query**: `string`

The search query for locations.

#### Returns

`Promise`\<`LocationsResponse`\>

A list of locations matching the query.

#### Throws

If the request fails.

#### Defined in

index.ts:169

***

### getProfiles()

> **getProfiles**(`query`?, `role`?): `Promise`\<`ProfilesResponse`\>

Retrieves profiles based on the provided query and role.

#### Parameters

• **query?**: `string`

The search query for profiles.

• **role?**: `string`

The role to filter profiles by.

#### Returns

`Promise`\<`ProfilesResponse`\>

A list of profiles matching the criteria.

#### Throws

If the request fails.

#### Defined in

index.ts:147
