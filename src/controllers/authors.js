import {
  getAllAuthors as getAllAuthorsFromDb,
  getAuthorById as getAuthorByIdFromDb,
  createAuthor as createAuthorInDb,
  updateAuthor as updateAuthorInDb,
  deleteAuthor as deleteAuthorFromDb,
  authorHasBooks
} from '../models/authors.js';

const hasMissingValue = (value) => {
  return value === undefined
    || value === null
    || (typeof value === 'string' && value.trim() === '');
};

const getAllAuthors = async (req, res) => {
  try {
    const authors = await getAllAuthorsFromDb();
    return res.status(200).json(authors);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to retrieve authors.' });
  }
};

const getAuthorById = async (req, res) => {
  try {
    const author = await getAuthorByIdFromDb(req.params.id);
    if (!author) {
      return res.status(404).json({ message: 'Author not found.' });
    }

    return res.status(200).json(author);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to retrieve author.' });
  }
};

const createAuthor = async (req, res) => {
  const { id, name, birthYear } = req.body || {};
  if (hasMissingValue(id) || hasMissingValue(name) || hasMissingValue(birthYear)) {
    return res.status(400).json({ message: 'id, name, and birthYear are required.' });
  }

  try {
    const existingAuthor = await getAuthorByIdFromDb(id);
    if (existingAuthor) {
      return res.status(400).json({ message: 'An author with that id already exists.' });
    }

    const author = { id, name, birthYear };
    await createAuthorInDb(author);
    return res.status(201).json(author);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to create author.' });
  }
};

const updateAuthor = async (req, res) => {
  const { name, birthYear } = req.body || {};
  if (hasMissingValue(name) || hasMissingValue(birthYear)) {
    return res.status(400).json({ message: 'name and birthYear are required.' });
  }

  try {
    const existingAuthor = await getAuthorByIdFromDb(req.params.id);
    if (!existingAuthor) {
      return res.status(404).json({ message: 'Author not found.' });
    }

    await updateAuthorInDb(req.params.id, { name, birthYear });
    const updatedAuthor = await getAuthorByIdFromDb(req.params.id);
    return res.status(200).json(updatedAuthor);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update author.' });
  }
};

const deleteAuthor = async (req, res) => {
  try {
    const existingAuthor = await getAuthorByIdFromDb(req.params.id);
    if (!existingAuthor) {
      return res.status(404).json({ message: 'Author not found.' });
    }

    if (await authorHasBooks(req.params.id)) {
      return res.status(409).json({ message: 'Cannot delete an author who still has books.' });
    }

    await deleteAuthorFromDb(req.params.id);
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: 'Unable to delete author.' });
  }
};

export {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor
};