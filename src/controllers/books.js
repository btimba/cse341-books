import {
  authorExists,
  createBook,
  deleteBook,
  getAllBooks,
  getBookById,
  updateBook,
} from '../models/books.js';

const idPattern = /^[a-z0-9-]{1,32}$/;

const validationError = (res, details) => {
  return res.status(400).json({ error: 'Validation failed', details });
};

const validateBookId = (id) => {
  return idPattern.test(id) ? [] : ['id must contain only lowercase letters, digits, and hyphens'];
};

const validateBookFields = (body, requiredFields) => {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return ['body must be a JSON object'];
  }

  const allowedFields = new Set(['id', 'authorId', 'title', 'publicationDate']);
  const unknownField = Object.keys(body).find((field) => {return !allowedFields.has(field)});
  if (unknownField) return [`unknown field: ${unknownField}`];

  for (const field of requiredFields) {
    if (body[field] === undefined || body[field] === null) {
      return [`${field} is required`];
    }
  }

  for (const field of ['id', 'authorId', 'title', 'publicationDate']) {
    if (body[field] !== undefined && (typeof body[field] !== 'string' || !body[field].trim())) {
      return [`${field} must be a non-empty string`];
    }
  }
  if (body.id !== undefined && !idPattern.test(body.id)) {
    return ['id must contain only lowercase letters, digits, and hyphens'];
  }

  return [];
};

const getBooksHandler = async (req, res) => {
  try {
    return res.status(200).json(await getAllBooks());
  } catch (error) {
    console.error('GET /books failed:', error);
    return res.status(500).json({ error: 'Internal server error', details: [] });
  }
};

const getBookByIdHandler = async (req, res) => {
  try {
    const book = await getBookById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found', details: [] });
    return res.status(200).json(book);
  } catch (error) {
    console.error('GET /books/:id failed:', error);
    return res.status(500).json({ error: 'Internal server error', details: [] });
  }
};

const createBookHandler = async (req, res) => {
  const errors = validateBookFields(req.body, ['id', 'authorId', 'title', 'publicationDate']);
  if (errors.length) return validationError(res, errors);

  const book = {
    id: req.body.id,
    authorId: req.body.authorId,
    title: req.body.title.trim(),
    publicationDate: req.body.publicationDate.trim(),
  };
  try {
    if (!(await authorExists(book.authorId))) {
      return validationError(res, ['authorId must match an existing author']);
    }
    return res.status(201).json(await createBook(book));
  } catch (error) {
    if (error?.code === 11000) return validationError(res, ['id already exists']);
    console.error('POST /books failed:', error);
    return res.status(500).json({ error: 'Internal server error', details: [] });
  }
};

const updateBookHandler = async (req, res) => {
  const idErrors = validateBookId(req.params.id);
  if (idErrors.length) return validationError(res, idErrors);

  const errors = validateBookFields(req.body, ['authorId', 'title', 'publicationDate']);
  if (errors.length) return validationError(res, errors);

  try {
    if (!(await getBookById(req.params.id))) {
      return res.status(404).json({ error: 'Book not found', details: [] });
    }
    if (!(await authorExists(req.body.authorId))) {
      return validationError(res, ['authorId must match an existing author']);
    }
    const book = {
      authorId: req.body.authorId,
      title: req.body.title.trim(),
      publicationDate: req.body.publicationDate.trim(),
    };
    return res.status(200).json(await updateBook(req.params.id, book));
  } catch (error) {
    console.error('PUT /books/:id failed:', error);
    return res.status(500).json({ error: 'Internal server error', details: [] });
  }
};

const deleteBookHandler = async (req, res) => {
  const idErrors = validateBookId(req.params.id);
  if (idErrors.length) return validationError(res, idErrors);

  try {
    const result = await deleteBook(req.params.id);
    if (!result.deletedCount) return res.status(404).json({ error: 'Book not found', details: [] });
    return res.status(204).send();
  } catch (error) {
    console.error('DELETE /books/:id failed:', error);
    return res.status(500).json({ error: 'Internal server error', details: [] });
  }
};

export {
  getBooksHandler,
  getBookByIdHandler,
  createBookHandler,
  updateBookHandler,
  deleteBookHandler,
};
