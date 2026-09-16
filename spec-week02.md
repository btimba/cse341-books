# Books API Week 02 Spec - Version 1

## Feature 1: Book CRUD Operations and Author References

### Goal
Update the existing Week 01 book API so book documents include a reference to an author and the API supports all CRUD operations for books. Every book route must be documented and testable in Swagger.

### Data Model
Book documents will be stored in the `books` collection.

Required book fields:
- `id`: string, required, custom id such as `b1`
- `authorId`: string, required, references the `id` field of an author document
- `title`: string, required
- `publicationDate`: string, required

Books will continue to use custom string ids instead of MongoDB `_id` values for route parameters.

### Relationship to Authors
Each book will identify its author with an `authorId` field. The value of `authorId` must match the custom `id` value of an existing author document.

When creating or updating a book, the API should reject the request with a `400` status code if the submitted `authorId` does not match an existing author.

### Routes

#### GET /books
Purpose: Return all books.

Success:
- Status code: `200`
- Response body: an array of book objects

Errors:
- `500` if an unexpected server or database error occurs

#### GET /books/:id
Purpose: Return one book by its custom id.

Success:
- Status code: `200`
- Response body: the matching book object

Errors:
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### POST /books
Purpose: Create a new book.

Request body:

    {
      "id": "b4",
      "authorId": "a1",
      "title": "Example Book Title",
      "publicationDate": "2026-01-15"
    }

Success:
- Status code: `201`
- Response body: the newly created book object

Errors:
- `400` if a required field is missing
- `400` if the `id` already exists
- `400` if the `authorId` does not match an existing author
- `500` if an unexpected server or database error occurs

#### PUT /books/:id
Purpose: Update an existing book.

Request body:

    {
      "authorId": "a2",
      "title": "Updated Book Title",
      "publicationDate": "2026-02-20"
    }

Success:
- Status code: `200`
- Response body: the updated book object

Errors:
- `400` if a required field is missing
- `400` if the `authorId` does not match an existing author
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### DELETE /books/:id
Purpose: Delete an existing book.

Success:
- Status code: `204`
- Response body: none

Errors:
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

### Swagger Documentation
Swagger must document every book route.

### Deployment Expectations
After implementation, the book routes must work locally and from the deployed Render application. The deployed Swagger page at `/api-docs` must allow someone to test every book route from the browser.

## Feature 2: Author CRUD Operations

# Books API Week 02 Spec - Version 1

## Feature 1: Book CRUD Operations and Author References

### Goal

Update the existing Week 01 book API so book documents include a reference to an author and the API supports all CRUD operations for books. Every book route must be documented and testable in Swagger.

### Data Model

Book documents will be stored in the `books` collection.

Required book fields:

* `id`: string, required, custom id such as `b1`
* `authorId`: string, required, references the `id` field of an author document
* `title`: string, required
* `publicationDate`: string, required

Books will continue to use custom string ids instead of MongoDB `_id` values for route parameters.

### Relationship to Authors

Each book will identify its author with an `authorId` field. The value of `authorId` must match the custom `id` value of an existing author document.

When creating or updating a book, the API should reject the request with a `400` status code if the submitted `authorId` does not match an existing author.

### Routes

#### GET /books

Purpose: Return all books.

Success:

* Status code: `200`
* Response body: an array of book objects

Errors:

* `500` if an unexpected server or database error occurs

#### GET /books/:id

Purpose: Return one book by its custom id.

Success:

* Status code: `200`
* Response body: the matching book object

Errors:

* `404` if no book exists with that id
* `500` if an unexpected server or database error occurs

#### POST /books

Purpose: Create a new book.

Request body:

```
{
  "id": "b4",
  "authorId": "a1",
  "title": "Example Book Title",
  "publicationDate": "2026-01-15"
}
```

Success:

* Status code: `201`
* Response body: the newly created book object

Errors:

* `400` if a required field is missing
* `400` if the `id` already exists
* `400` if the `authorId` does not match an existing author
* `500` if an unexpected server or database error occurs

#### PUT /books/:id

Purpose: Update an existing book.

Request body:

```
{
  "authorId": "a2",
  "title": "Updated Book Title",
  "publicationDate": "2026-02-20"
}
```

Success:

* Status code: `200`
* Response body: the updated book object

Errors:

* `400` if a required field is missing
* `400` if the `authorId` does not match an existing author
* `404` if no book exists with that id
* `500` if an unexpected server or database error occurs

#### DELETE /books/:id

Purpose: Delete an existing book.

Success:

* Status code: `204`
* Response body: none

Errors:

* `404` if no book exists with that id
* `500` if an unexpected server or database error occurs

### Swagger Documentation

Swagger must document every book route.

### Deployment Expectations

After implementation, the book routes must work locally and from the deployed Render application. The deployed Swagger page at `/api-docs` must allow someone to test every book route from the browser.

---

# Feature 2: Author CRUD Operations

### Goal

Add a complete CRUD API for authors. The API will allow clients to create, view, update, and delete author documents. Each author will have a custom string id that can be referenced by books through the `authorId` field. Every author route must be documented and testable in Swagger.

### Data Model

Author documents will be stored in the `authors` collection.

Required author fields:

* `id`: string, required, custom id such as `a1`
* `firstName`: string, required
* `lastName`: string, required
* `email`: string, required
* `birthDate`: string, required

Authors will use custom string ids instead of MongoDB `_id` values for route parameters.

### Relationship to Books

Books reference authors through the `authorId` field.

The value of a book's `authorId` must match the custom `id` value of an existing author document.

An author cannot be deleted while one or more books still reference that author.

If a client attempts to delete an author who still has books associated with them, the API should reject the request with a `400` status code. The author and associated books must remain unchanged.

### Routes

#### GET /authors

Purpose: Return all authors.

Success:

* Status code: `200`
* Response body: an array of author objects

Example response:

```
[
  {
    "id": "a1",
    "firstName": "George",
    "lastName": "Orwell",
    "email": "george.orwell@example.com",
    "birthDate": "1903-06-25"
  },
  {
    "id": "a2",
    "firstName": "Jane",
    "lastName": "Austen",
    "email": "jane.austen@example.com",
    "birthDate": "1775-12-16"
  }
]
```

Errors:

* `500` if an unexpected server or database error occurs

#### GET /authors/:id

Purpose: Return one author by their custom id.

Success:

* Status code: `200`
* Response body: the matching author object

Example response:

```
{
  "id": "a1",
  "firstName": "George",
  "lastName": "Orwell",
  "email": "george.orwell@example.com",
  "birthDate": "1903-06-25"
}
```

Errors:

* `404` if no author exists with that id
* `500` if an unexpected server or database error occurs

#### POST /authors

Purpose: Create a new author.

Request body:

```
{
  "id": "a3",
  "firstName": "Mark",
  "lastName": "Twain",
  "email": "mark.twain@example.com",
  "birthDate": "1835-11-30"
}
```

Success:

* Status code: `201`
* Response body: the newly created author object

Errors:

* `400` if a required field is missing
* `400` if the `id` already exists
* `400` if the email address already exists
* `500` if an unexpected server or database error occurs

#### PUT /authors/:id

Purpose: Update an existing author.

Request body:

```
{
  "firstName": "Samuel",
  "lastName": "Clemens",
  "email": "samuel.clemens@example.com",
  "birthDate": "1835-11-30"
}
```

Success:

* Status code: `200`
* Response body: the updated author object

Errors:

* `400` if a required field is missing
* `400` if the email address is already associated with another author
* `404` if no author exists with that id
* `500` if an unexpected server or database error occurs

#### DELETE /authors/:id

Purpose: Delete an existing author.

Success:

* Status code: `204`
* Response body: none

Errors:

* `400` if the author still has one or more books associated with them
* `404` if no author exists with that id
* `500` if an unexpected server or database error occurs

### Swagger Documentation

Swagger must document every author route.

Swagger documentation should include:

* The `GET /authors` route
* The `GET /authors/:id` route
* The `POST /authors` route
* The `PUT /authors/:id` route
* The `DELETE /authors/:id` route
* Required author fields
* Example request bodies
* Expected success responses
* Expected error responses

### Deployment Expectations

After implementation, the author routes must work locally and from the deployed Render application. The deployed Swagger page at `/api-docs` must allow someone to test every author route from the browser.

The author API must work together with the book API so that books can reference existing authors and authors cannot be deleted while books still reference them.
