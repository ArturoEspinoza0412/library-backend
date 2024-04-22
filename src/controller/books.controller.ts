import mongoose from "mongoose";
import BookModel from "../models/books.model";
import { IBook } from "../interface/books.interface";
import IResponse from "../interface/response.interface";

export default class BookController {
  async createBook(bookData: IBook): Promise<IResponse> {
    try {
      const createdBook = await BookModel.create(bookData);
      return {
        ok: true,
        message: "Book created",
        response: createdBook,
        code: 201,
      };
    } catch (error) {
      return {
        ok: false,
        message: "Error creating book",
        response: error,
        code: 500,
      };
    }
  }

  async getBookById(bookId: mongoose.Types.ObjectId): Promise<IResponse> {
    try {
      const book = await BookModel.findById(bookId);
      if (!book) {
        return {
          ok: false,
          message: "Book not found",
          response: null,
          code: 404,
        };
      }
      return { ok: true, message: "Book retrieved", response: book, code: 200 };
    } catch (error) {
      return {
        ok: false,
        message: "Error retrieving book",
        response: error,
        code: 500,
      };
    }
  }

  async getAllBooks(): Promise<IResponse> {
    try {
      const books = await BookModel.find();
      return {
        ok: true,
        message: "Books retrieved",
        response: books,
        code: 200,
      };
    } catch (error) {
      return {
        ok: false,
        message: "Error listing books",
        response: error,
        code: 500,
      };
    }
  }

  async updateBook(
    bookId: mongoose.Types.ObjectId,
    updatedData: IBook
  ): Promise<IResponse> {
    try {
      const updatedBook = await BookModel.findByIdAndUpdate(
        bookId,
        updatedData,
        { new: true }
      );
      if (!updatedBook) {
        return {
          ok: false,
          message: "Book not found for update",
          response: null,
          code: 404,
        };
      }
      return {
        ok: true,
        message: "Book updated",
        response: updatedBook,
        code: 200,
      };
    } catch (error) {
      return {
        ok: false,
        message: "Error updating book",
        response: error,
        code: 500,
      };
    }
  }

  async deleteBook(bookId: mongoose.Types.ObjectId): Promise<IResponse> {
    try {
      const deletedBook = await BookModel.findByIdAndDelete(bookId);
      if (!deletedBook) {
        return {
          ok: false,
          message: "Book not found for deletion",
          response: null,
          code: 404,
        };
      }
      return {
        ok: true,
        message: "Book deleted",
        response: deletedBook,
        code: 200,
      };
    } catch (error) {
      return {
        ok: false,
        message: "Error deleting book",
        response: error,
        code: 500,
      };
    }
  }

  async getBooksByCategory(categoryName: string): Promise<IResponse> {
    try {
      const books = await BookModel.find({ "categories.name": categoryName });
      return {
        ok: true,
        message: "Books retrieved by category",
        response: books,
        code: 200,
      };
    } catch (error) {
      return {
        ok: false,
        message: "Error retrieving books by category",
        response: error,
        code: 500,
      };
    }
  }
}
