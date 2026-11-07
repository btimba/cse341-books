import { getDb } from '../db/connect.js';

const bookProjection = { _id: 0, id: 1, authorId: 1, title: 1, publicationDate: 1 };

const getAllBooks = async () => {
  const db = getDb();
  return db.collection('books').find({}).project(bookProjection).toArray();
};

const getBookById = async (id) => {
  const db = getDb();
  return db.collection('books').findOne({ id }, { projection: bookProjection });
};

const createBook = async (book) => {
  const db = getDb();
  await db.collection('books').insertOne(book);
  return book;
};

const updateBook = async (id, book) => {
  const db = getDb();
  return db.collection('books').findOneAndUpdate(
    { id },
    { $set: book },
    { returnDocument: 'after', projection: bookProjection },
  );
};

const deleteBook = async (id) => {
  const db = getDb();
  return db.collection('books').deleteOne({ id });
};

const authorExists = async (authorId) => {
  const db = getDb();
  return Boolean(await db.collection('authors').findOne({ id: authorId }, { projection: { _id: 1 } }));
};

export {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  authorExists,
};
