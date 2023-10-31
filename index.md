---
title: Reference Overview
---

# Universal Logout

When an identity provider such as Okta detects identity threats or responds to employee termination events, it can prevent the user from logging in to applications in the future. However, this by itself doesn't affect a user's existing sessions or tokens within an application.

Universal Logout is a way for an identity provider (IdP) or a security incident management tool to indicate to an application that all of a user's existing sessions should be revoked and the user should be logged out of the app.

The application will need to build a Universal Logout endpoint to handle the logout requests. The Universal Logout endpoint will receive a request to log out a particular user, and should attempt to revoke all sessions and tokens for the user, and return a result indicating success or failure.

**[Read the full API Specification here](/openapi/logout/logout/tag/UniversalLogout/)**

If you're building an application that is used by enterprise customers, and would like to empower your customers to instantly mitigate risks across their ecosystem, read on for what you need to do to support Universal Logout with Okta.

## Universal Logout Endpoint

The actual endpoint URL is up to the discrection of the application, it will just need to be registered .

### Endpoint Authentication

The request to the Universal Logout endpoint requires authentication so that your application knows the request is coming from Okta. At launch, Okta likely is able to support your existing API authentication scheme, especially if it is one of the following:

* API key sent in the `Authorization` header, e.g. `Authorization: Bearer X1234`
* API key sent in a custom HTTP header

### Logout Request

When a user should be logged out of the application, Okta will make a POST request to the Universal Logout endpoint. The request will include a JSON object that describes the user who should be logged out.

By default, users will be identified by their email address. If the application supports provisioning with Okta, the users will be identified by ther user ID within the application. The user identifier is sent in the format defined by [Subject Identifiers for Security Event Tokens](https://datatracker.ietf.org/doc/html/draft-ietf-secevent-subject-identifiers-18), as either an `EmailSubject` or `Opaque` identifier. 

For example, a user is indicated by their email address:

```
{
  "subject": {
    "format": "email",
    "email": "user@example.com"
  }
}
```

or by their user identifier within the application:

```
{
  "subject": {
    "format": "opaque",
    "email": "d563aec52"
  }
}
```


### Logout Response

The response should indicate whether the logout request was successful, if the application is unable to log out the user, or if there is some other error. The response body is ignored by the caller, only the HTTP status code is used to indicate success or failure.

(See [Revocation Details](#revocation-details) below for more information on what needs to be revoked in order to be considered a success.)

Your application should first validate the request authentication, and return an error if the request is missing credentials or if the credentials are invalid. You can indicate this error with an HTTP `401` or `403` response code.

* `401 Unauthorized` - The request was missing authentication or the authentication was invalid.
* `403 Forbidden` - The provided authorization is insufficient to perform the requested operation, e.g. missing scope.

If the request was malformed, or includes a subject identifier of some other unrecognized type, your application can return HTTP `400`.

* `400 Bad Request` - The request was malformed, contains invalid or unrecognized properties, or an unrecognized subject identifier type.

Your application should look up the user identified by the subject identifier, and return `404` if the user was not found.

* `404 Not Found` - The user indicated by the subject identifier was not found.

At this point, your application should attempt to log out the user. If there is some reason this is not possible, your application can return HTTP `422`.

* `422 Unprocessable Content` - The application is unable to log out the user.

If the logout request succeeded, your application returns HTTP `204`.

* `204 No Content` - A `204` response indicates a successful request, and that the user will be logged out.


## Revocation Details {#revocation-details}

Receiving a Universal Logout request is a clear communication that all of this user's existing sessions and tokens should be revoked as fast as possible.

In many cases, it is not possible to instantaneously revoke all sessions and tokens, such as when using JWT access tokens, or when an application is deployed across multiple independent data centers. Because of this, a "Success" response to the logout request indicates that the application is doing everything within its power to log out all credentials possible.

In particular, the application should revoke:

* all OAuth refresh tokens for the user
* all session cookies for the user

The application is not expected to revoke access tokens, as it may not be technically possible. If your application does happen to be able to revoke access tokens then you should revoke them, but it is not required to be considered successfully logged out.

<!--
## Share the details of your logout endpoint

To be included in Okta's launch of Universal Logout, we'll need the details of your logout endpoint that are not part of this specification. In particular, we need to know:

* The URL of your Universal Logout endpoint
* What type of API authentication your endpoint uses
-->

