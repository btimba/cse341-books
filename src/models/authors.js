import { getDb } from '../db/connect.js';

const getAllAuthors = async () => {
  const db = getDb();
  const collection = db.collection('authors');
  const authors = await collection.find({}).toArray();

  return authors;
};

const getAuthorById = async (id) => {
  const db = getDb();
  const collection = db.collection('authors');

  return collection.findOne({ id });
};

const createAuthor = async (author) => {
  const db = getDb();
  const collection = db.collection('authors');

  return collection.insertOne(author);
};

const updateAuthor = async (id, author) => {
  const db = getDb();
  const collection = db.collection('authors');

  return collection.updateOne({ id }, { $set: author });
};

const deleteAuthor = async (id) => {
  const db = getDb();
  const collection = db.collection('authors');

  return collection.deleteOne({ id });
};

const authorHasBooks = async (id) => {
  const db = getDb();
  const collection = db.collection('books');

  return (await collection.countDocuments({ authorId: id })) > 0;
};

export {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  authorHasBooks
};