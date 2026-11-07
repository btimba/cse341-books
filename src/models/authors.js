import { getDb } from '../db/connect.js';

const authorProjection = { _id: 0, id: 1, name: 1, birthYear: 1 };

const getAllAuthors = async () => {
  const db = getDb();
  const collection = db.collection('authors');
  const authors = await collection.find({}).project(authorProjection).toArray();

  return authors;
};

const getAuthorById = async (id) => {
  const db = getDb();
  return db.collection('authors').findOne({ id }, { projection: authorProjection });
};

const createAuthor = async (author) => {
  const db = getDb();
  await db.collection('authors').insertOne(author);
  return author;
};

const updateAuthor = async (id, author) => {
  const db = getDb();
  const result = await db.collection('authors').findOneAndUpdate(
    { id },
    { $set: author },
    { returnDocument: 'after', projection: authorProjection },
  );
  return result;
};

const deleteAuthor = async (id) => {
  const db = getDb();
  return db.collection('authors').deleteOne({ id });
};

const hasBooksByAuthor = async (authorId) => {
  const db = getDb();
  return Boolean(await db.collection('books').findOne({ authorId }, { projection: { _id: 1 } }));
};

export {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  hasBooksByAuthor,
};