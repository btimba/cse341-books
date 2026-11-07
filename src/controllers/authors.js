import {
  createAuthor,
  deleteAuthor,
  getAllAuthors as getAllAuthorsFromDb,
  getAuthorById,
  hasBooksByAuthor,
  updateAuthor,
} from '../models/authors.js';

const idPattern = /^[a-z0-9-]{1,32}$/;
const currentYear = new Date().getFullYear();

const validationError = (res, details) => {
  return res.status(400).json({ error: 'Validation failed', details });
};

const validateId = (id) => {
  return idPattern.test(id) ? [] : ['id must contain only lowercase letters, digits, and hyphens'];
};

const validateAuthorFields = (body, allowedFields, requiredFields = allowedFields) => {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return ['body must be a JSON object'];
  }

  const allowedFieldSet = new Set(allowedFields);
  const unknownField = Object.keys(body).find((field) => {
    return !allowedFieldSet.has(field);
  });
  if (unknownField) {
    return [`unknown field: ${unknownField}`];
  }

  for (const field of requiredFields) {
    if (body[field] === undefined || body[field] === null) {
      return [`${field} is required`];
    }
  }
  if (body.id !== undefined && (typeof body.id !== 'string' || !body.id.trim())) {
    return ['id must be a non-empty string'];
  }
  if (body.id !== undefined && !idPattern.test(body.id)) {
    return ['id must contain only lowercase letters, digits, and hyphens'];
  }
  if (typeof body.name !== 'string' || !body.name.trim()) {
    return ['name must be a non-empty string'];
  }
  if (body.name.trim().length > 200) {
    return ['name must be 200 characters or fewer'];
  }
  if (
    !Number.isInteger(body.birthYear) ||
    body.birthYear < -3000 ||
    body.birthYear > currentYear
  ) {
    return [`birthYear must be an integer from -3000 to ${currentYear}`];
  }

  return [];
};

const getAllAuthors = async (req, res) => {
  try {
    const authors = await getAllAuthorsFromDb();
    return res.status(200).json(authors);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to retrieve authors.' });
  }
};

const getAuthorByIdHandler = async (req, res) => {
  const idErrors = validateId(req.params.id);
  if (idErrors.length) return validationError(res, idErrors);

  try {
    const author = await getAuthorById(req.params.id);
    if (!author) return res.status(404).json({ error: 'Author not found', details: [] });
    return res.status(200).json(author);
  } catch (error) {
    console.error('GET /authors/:id failed:', error);
    return res.status(500).json({ error: 'Internal server error', details: [] });
  }
};

const createAuthorHandler = async (req, res) => {
  const errors = validateAuthorFields(req.body, ['id', 'name', 'birthYear']);
  if (errors.length) return validationError(res, errors);

  const author = { id: req.body.id, name: req.body.name.trim(), birthYear: req.body.birthYear };
  try {
    await createAuthor(author);
    return res.status(201).json(author);
  } catch (error) {
    if (error?.code === 11000) {
      return validationError(res, ['id already exists']);
    }
    console.error('POST /authors failed:', error);
    return res.status(500).json({ error: 'Internal server error', details: [] });
  }
};

const updateAuthorHandler = async (req, res) => {
  const idErrors = validateId(req.params.id);
  if (idErrors.length) return validationError(res, idErrors);

  const errors = validateAuthorFields(req.body, ['id', 'name', 'birthYear'], ['name', 'birthYear']);
  if (errors.length) return validationError(res, errors);
  if (req.body.id !== undefined && req.body.id !== req.params.id) {
    return validationError(res, ['id must match the URL id']);
  }

  try {
    const existingAuthor = await getAuthorById(req.params.id);
    if (!existingAuthor) return res.status(404).json({ error: 'Author not found', details: [] });

    const author = { name: req.body.name.trim(), birthYear: req.body.birthYear };
    const updatedAuthor = await updateAuthor(req.params.id, author);
    return res.status(200).json(updatedAuthor);
  } catch (error) {
    console.error('PUT /authors/:id failed:', error);
    return res.status(500).json({ error: 'Internal server error', details: [] });
  }
};

const deleteAuthorHandler = async (req, res) => {
  const idErrors = validateId(req.params.id);
  if (idErrors.length) return validationError(res, idErrors);

  try {
    const author = await getAuthorById(req.params.id);
    if (!author) return res.status(404).json({ error: 'Author not found', details: [] });
    if (await hasBooksByAuthor(req.params.id)) {
      return res.status(400).json({
        error: 'Author cannot be deleted',
        details: [`Author '${req.params.id}' is still referenced by one or more books`],
      });
    }

    await deleteAuthor(req.params.id);
    return res.status(204).send();
  } catch (error) {
    console.error('DELETE /authors/:id failed:', error);
    return res.status(500).json({ error: 'Internal server error', details: [] });
  }
};

export {
  getAllAuthors,
  getAuthorByIdHandler,
  createAuthorHandler,
  updateAuthorHandler,
  deleteAuthorHandler,
};
