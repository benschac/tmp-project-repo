# todo

1. finish my own nextjs api and get a real resonse from the api
1. refresh token
1. disco backend
1. react sdk
1. react tanstack sdk

# recurse-center

typescript sdk to interact with [recurse-center api](https://github.com/recursecenter/wiki/wiki/Recurse-Center-API)

## [OAuth 2.0](https://github.com/recursecenter/wiki/wiki/Recurse-Center-API#oauth-20)

The Recurse Center API allows OAuth 2.0 for authentication. When you write an app that uses OAuth, recurse.com asks a user for permission for your app to use the API on their behalf. If the user gives permission, recurse.com will give your app an access token that allows you to use the API as that user. The user can revoke your app's permission at any time. Once you have an access token, you can use it either in the Authorization HTTP header or in the access_token query parameter to make API requests. For details on how to do this, see the "Making requests" section further down in this page.

Describing how OAuth works in detail is beyond the scope of this documentation. Most programming langauges have OAuth 2 clients that automate most of the complicated parts of this process in a few lines of code.

The authorization endpoint is /oauth/authorize. Authorization codes are the only supported authorization grant type. The token endpoint is /oauth/token. Access tokens are good for two hours. The token endpoint also gives refresh tokens that can be used to request new access tokens. Refresh tokens can only be used once: when you use a refresh token, you will be given a new access token and a new refresh token. Your OAuth 2 client library should be able to handle this automatically. You can make a new application on your settings page.

The redirect URI submitted with the authorization request must exactly match the redirect URI associated with your app on recurse.com. If you are experimenting with an OAuth client at the command line and don't yet have an HTTP server that the user can be redirected to, you can use urn:ietf:wg:oauth:2.0:oob as your redirect URI, which will cause recurse.com to render the authorization code in the browser.

# Setup

1. register your application
1.
