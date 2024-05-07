import mongoose from "mongoose"
import BookModel from "../models/books.model"
import { IBook } from "../interface/books.interface"
import IResponse from "../interface/response.interface"
import csvToJson from "csvtojson"
import Server from "../class/server.class"

export default class BookController {

  private server: Server
  private connection = null

  constructor() {
    this.server = Server.instance
  }

  async createBook(bookData: IBook): Promise<IResponse> {

    try {
      const existingBook = await BookModel.findOne({ title: bookData.title, author: bookData.author })
      if (existingBook) {
        return {
          ok: false,
          message: "A book with the same title and author already exists",
          response: null,
          code: 400,
        }
      }

      this.connection = this.server.getApp().locals.dbConnection

      const createdBook = await BookModel.create(bookData)
      return {
        ok: true,
        message: "Book created",
        response: createdBook,
        code: 200,
      }
    } catch (error) {
      return {
        ok: false,
        message: "Error creating book",
        response: error,
        code: 500,
      }
    } finally {
      if (this.connection) {
        await this.server.getApp().locals.dbConnection.release(this.connection) // Liberamos la conexión
      }
    }
  }

  async getBookById(bookId: mongoose.Types.ObjectId): Promise<IResponse> {
    try {
      this.connection = this.server.getApp().locals.dbConnection

      const book = await BookModel.findById(bookId)
      if (!book) {
        return {
          ok: false,
          message: "Book not found",
          response: null,
          code: 404,
        }
      }
      return { ok: true, message: "Book retrieved", response: book, code: 200 }
    } catch (error) {
      return {
        ok: false,
        message: "Error retrieving book",
        response: error,
        code: 500,
      }
    } finally {
      if (this.connection) {
        await this.server.getApp().locals.dbConnection.release(this.connection)
      }
    }
  }

  async getAllBooks(): Promise<IResponse> {
    try {
      this.connection = this.server.getApp().locals.dbConnection

      const books = await BookModel.find()
      if (books.length === 0) {
        return {
          ok: false,
          message: "No books found",
          response: null,
          code: 404,
        }
      }
      return {
        ok: true,
        message: "Books retrieved",
        response: books,
        code: 200,
      }
    } catch (error) {
      return {
        ok: false,
        message: "Error listing books",
        response: error,
        code: 500,
      }
    } finally {
      if (this.connection) {
        await this.server.getApp().locals.dbConnection.release(this.connection)
      }
    }
  }

  async updateBook(
    bookId: mongoose.Types.ObjectId,
    updatedData: IBook
  ): Promise<IResponse> {
    try {
      this.connection = this.server.getApp().locals.dbConnection

      const updatedBook = await BookModel.findByIdAndUpdate(
        bookId,
        updatedData,
        { new: true }
      )
      if (!updatedBook) {
        return {
          ok: false,
          message: "Book not found for update",
          response: null,
          code: 404,
        }
      }
      return {
        ok: true,
        message: "Book updated",
        response: updatedBook,
        code: 200,
      }
    } catch (error) {
      return {
        ok: false,
        message: "Error updating book",
        response: error,
        code: 500,
      }
    } finally {
      if (this.connection) {
        await this.server.getApp().locals.dbConnection.release(this.connection)
      }
    }
  }

  async deleteBook(bookId: mongoose.Types.ObjectId): Promise<IResponse> {
    try {
      this.connection = this.server.getApp().locals.dbConnection

      const deletedBook = await BookModel.findByIdAndDelete(bookId)
      if (!deletedBook) {
        return {
          ok: false,
          message: "Book not found for deletion",
          response: null,
          code: 404,
        }
      }
      return {
        ok: true,
        message: "Book deleted",
        response: deletedBook,
        code: 200,
      }
    } catch (error) {
      return {
        ok: false,
        message: "Error deleting book",
        response: error,
        code: 500,
      }
    } finally {
      if (this.connection) {
        await this.server.getApp().locals.dbConnection.release(this.connection)
      }
    }
  }

  async getBooksByCategory(categoryName: string): Promise<IResponse> {
    try {
      this.connection = this.server.getApp().locals.dbConnection

      const books = await BookModel.find({ "categories.name": categoryName })
      return {
        ok: true,
        message: "Books retrieved by category",
        response: books,
        code: 200,
      }
    } catch (error) {
      return {
        ok: false,
        message: "Error retrieving books by category",
        response: error,
        code: 500,
      }
    } finally {
      if (this.connection) {
        await this.server.getApp().locals.dbConnection.release(this.connection)
      }
    }
  }

  async cargaMasiva(file: Express.Multer.File): Promise<IResponse> {
    try {
      if (!file || !file.buffer) {
        return {
          ok: false,
          message: "Info doesn't exist",
          response: null,
          code: 400,
        }
      }

      this.connection = this.server.getApp().locals.dbConnection

      const fileContent = file.buffer.toString()
      const jsonArray = await csvToJson().fromString(fileContent)

      jsonArray.forEach((book: any) => {
        book.price = Number(book.price)
        book.quantity = Number(book.quantity)
        book.categories = {
          name: book.categories,
        }
      })

      const books = await BookModel.insertMany(jsonArray)

      return {
        ok: true,
        message: "Books created",
        response: books,
        code: 200,
      }
    } catch (error) {
      return {
        ok: false,
        message: "Error creating books",
        response: error,
        code: 500,
      }
    } finally {
      if (this.connection) {
        await this.server.getApp().locals.dbConnection.release(this.connection)
      }
    }
  }
}
