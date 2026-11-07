# Implement Author Collection and API

## Description
- Create the `authors` collection in MongoDB with a unique index on `id`.
- Add full CRUD operations for authors, plus a route to list an author's books.
- Validate author request bodies (including field types) before writing to MongoDB.
- Prevent deleting an author who still has books.
- Seed three test authors.
- Add Swagger documentation for all author routes.
- Test the author routes locally and in the deployed Render application.

This issue should be completed before the Book issue, because book writes validate `authorId` against existing authors.

## Spec
### Goal
Add an authors resource with full CRUD support, so the `authorId` values used by books refer to real author documents. Every author route must be documented and testable in Swagger.

### Data Model
Author documents will be stored in the `authors` collection.

Required author fields:
- `id`: string, required, custom id such as `a1`
- `name`: string, required
- `birthYear`: integer, required, the year the author was born, such as `1775`

Authors will use custom string ids instead of MongoDB `_id` values for route parameters, matching books.

Field rules:
- `id`: 1 to 32 characters, lowercase letters, digits, and hyphens only (`^[a-z0-9-]{1,32}$`)
- `name`: string, trimmed, 1 to 200 characters
- `birthYear`: integer (a JSON number, not a string) from `-3000` to the current year. Decimals, numeric strings such as `"1775"`, and `null` are rejected.
- A required field is invalid if it is missing, `null`, an empty or whitespace-only string, or of the wrong type.

Database requirements:
- Unique index on `id`
- Duplicate-key errors from MongoDB must be caught and returned as the duplicate `id` `400`
- One MongoDB client created at startup and reused for all requests

### Seed Data
Insert these three authors for testing:

    [
      { "id": "a1", "name": "Jane Austen", "birthYear": 1775 },
      { "id": "a2", "name": "Mary Shelley", "birthYear": 1797 },
      { "id": "a3", "name": "Chinua Achebe", "birthYear": 1930 }
    ]

### Relationship to Books
Books reference authors through `authorId`. Deleting an author who still has books returns `400`. The `id` of an author cannot be changed after creation.

### Request and Response Rules
- Bodies must be JSON objects. Malformed JSON returns a JSON `400`, not an HTML page.
- Only the listed fields are accepted. Unknown fields return `400`.
- Every value must match its field's type: strings, except `birthYear`, which is an integer. Objects or arrays (such as `{"$ne": null}`) return `400` before any query runs.
- Maximum request body size: 10 KB.
- Responses never include `_id` or `__v`.
- Author objects list fields in this order: `id`, `name`, `birthYear`.
- Unknown routes return a JSON `404`.

Every error response uses this shape:

    {
      "error": "Validation failed",
      "details": ["birthYear must be an integer"]
    }

`500` responses return a generic message with empty `details`. Stack traces and database messages are logged server-side only and never returned.

When a request has multiple problems, return the first failure in this order: body validation `400`, then `404`, then conflict check `400`, then `500`.

### Routes

#### GET /authors
Purpose: Return authors, paginated.

Query parameters (optional):
- `limit`: integer 1 to 100, default `50`
- `page`: integer 1 or greater, default `1`

Results are sorted by `id` ascending.

Success:
- Status code: `200`
- Response body: an array of author objects
- Header `X-Total-Count`: total number of authors

Example response:

    [
      {
        "id": "a1",
        "name": "Jane Austen",
        "birthYear": 1775
      }
    ]

Errors:
- `400` if `limit` or `page` is invalid
- `500` if an unexpected server or database error occurs

#### GET /authors/:id
Purpose: Return one author by their custom id.

Success:
- Status code: `200`
- Response body: the matching author object

Errors:
- `400` if `:id` does not match the id format
- `404` if no author exists with that id
- `500` if an unexpected server or database error occurs

#### GET /authors/:id/books
Purpose: Return all books by one author, paginated.

Query parameters (optional): `limit`, `page` (same rules as `GET /authors`).

Success:
- Status code: `200`
- Response body: an array of book objects (empty array if the author has no books)
- Header `X-Total-Count`: total number of matching books

Errors:
- `400` if `:id`, `limit`, or `page` is invalid
- `404` if no author exists with that id
- `500` if an unexpected server or database error occurs

#### POST /authors
Purpose: Create a new author.

Request body (all three fields required, no other fields allowed):

    {
      "id": "a4",
      "name": "Example Author Name",
      "birthYear": 1990
    }

Success:
- Status code: `201`
- Response body: the newly created author object

Errors:
- `400` if the body is malformed, a required field is missing or invalid (including a non-integer `birthYear`), or an unknown field is present
- `400` if the `id` already exists
- `500` if an unexpected server or database error occurs

#### PUT /authors/:id
Purpose: Update an existing author. This is a full replacement of the updatable fields: both `name` and `birthYear` are required.

Request body:

    {
      "name": "Updated Author Name",
      "birthYear": 1776
    }

The `id` cannot be changed. If the body includes `id`, it must equal the `:id` in the URL, otherwise return `400`.

Success:
- Status code: `200`
- Response body: the updated author object

Errors:
- `400` if the body is malformed, `name` or `birthYear` is missing or invalid, an unknown field is present, or a body `id` differs from the URL `id`
- `404` if no author exists with that id
- `500` if an unexpected server or database error occurs

#### DELETE /authors/:id
Purpose: Delete an existing author.

Success:
- Status code: `204`
- Response body: none

Errors:
- `400` if `:id` does not match the id format
- `404` if no author exists with that id
- `400` if one or more books still reference the author's `id` in `authorId`
- `500` if an unexpected server or database error occurs

Example `400` response when books still reference the author:

    {
      "error": "Author cannot be deleted",
      "details": ["Author 'a1' is still referenced by one or more books"]
    }

### Swagger Documentation
Swagger must document every author route, including:
- Request body schemas with an example for `POST` and `PUT`, with `birthYear` typed as an integer
- Query parameters for the list routes
- The `X-Total-Count` response header
- A response schema for every status code listed for the route, using a shared `Error` schema component

### Deployment Expectations
After implementation, the author routes must work locally and from the deployed Render application. The deployed Swagger page at `/api-docs` must allow someone to test every author route from the browser. The Swagger `servers` entry must point to the deployed Render URL.

## Test Plan
- Unique index exists on `authors.id`.
- The three seed authors (`a1`, `a2`, `a3`) exist and include `birthYear`.
- `GET /authors` returns 200 with an array of authors and an `X-Total-Count` header.
- `GET /authors?limit=0` returns 400.
- `GET /authors/:id` returns 200 with the matching author, including `birthYear`.
- `GET /authors/:id` returns 404 when the author does not exist.
- `GET /authors/:id/books` returns 200 with that author's books.
- `GET /authors/:id/books` returns 404 when the author does not exist.
- `POST /authors` creates an author and returns status 201.
- `POST /authors` returns 400 when `id` already exists.
- `POST /authors` returns 400 when `name` is missing, empty, a number, or an object.
- `POST /authors` returns 400 when `birthYear` is missing, a string such as `"1775"`, a decimal such as `1775.5`, or `null`.
- `POST /authors` returns 400 when an unknown field is included.
- `PUT /authors/:id` updates an existing author.
- `PUT /authors/:id` returns 400 when `birthYear` is missing.
- `PUT /authors/:id` returns 400 when the body `id` differs from the URL `id`.
- `PUT /authors/:id` returns 404 when the author does not exist.
- `DELETE /authors/:id` returns 400 when the author still has books.
- `DELETE /authors/:id` deletes an author with no books and returns 204.
- `DELETE /authors/:id` returns 404 when the author does not exist, including a repeated delete.
- Malformed JSON returns a JSON 400, not HTML.
- No response contains `_id`, `__v`, or a stack trace.
- All author routes are documented in Swagger.
- All author routes can be tested locally from `/api-docs`.
- All author routes can be tested from the deployed Render `/api-docs` page.