import { getAllBooks, getBookById, addBook, updateBook, deleteBook } from "../models/books.js";

const getBooksHandler = async (req, res) => {
    
    try {
        const books = await getAllBooks();
        return res.status(200).json(books);
    } catch (error) {
        console.error('Error fetching books:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getBookByIdHandler = async (req, res) => {
    const bookId = req.params.id;

    try {
        const book = await getBookById(bookId);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        return res.status(200).json(book);
    } catch (error) {
        console.error('Error fetching book:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const addBookHandler = async (req, res) => {
    const book = req.body;

    try {
        const result = await addBook(book);
        return res.status(201).json(result);
    } catch (error) {
        console.error('Error adding book:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateBookHandler = async (req, res) => {
    const bookId = req.params.id;
    const updatedBook = req.body;

    try {
        const result = await updateBook(bookId, updatedBook);
        return res.status(200).json(result);
    } catch (error) {
        console.error('Error updating book:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const deleteBookHandler = async (req, res) => {
    const bookId = req.params.id;

    try {
        const result = await deleteBook(bookId);
        return res.status(200).json(result);
    } catch (error) {
        console.error('Error deleting book:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export { 
        getBooksHandler,
        getBookByIdHandler,
        addBookHandler, 
        updateBookHandler, 
        deleteBookHandler
    }; 