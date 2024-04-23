import { Router, Request, Response } from 'express'
import BookController from './controller/books.controller'
import mongoose from 'mongoose'

const router = Router()
const bookController = new BookController()

router.post('/createBook', async (req: Request, res: Response) => {
  try {
    const response = await bookController.createBook(req.body)
    res.status(response.code).json(response)
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Internal Server Error', error })
  }
})

router.get('/books/:id', async (req: Request, res: Response) => {
  const bookId = new mongoose.Types.ObjectId(req.params.id)
  try {
    const response = await bookController.getBookById(bookId)
    res.status(response.code).json(response)
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Internal Server Error', error })
  }
})

router.get('/books', async (req: Request, res: Response) => {
  try {
    const response = await bookController.getAllBooks()
    res.status(response.code).json(response)
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Internal Server Error', error })
  }
})

router.put('/updateBook/:id', async (req: Request, res: Response) => {
  const bookId = new mongoose.Types.ObjectId(req.params.id)
  try {
    const response = await bookController.updateBook(bookId, req.body)
    res.status(response.code).json(response)
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Internal Server Error', error })
  }
})

router.delete('/deleteBook/:id', async (req: Request, res: Response) => {
  const bookId = new mongoose.Types.ObjectId(req.params.id)
  try {
    const response = await bookController.deleteBook(bookId)
    res.status(response.code).json(response)
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Internal Server Error', error })
  }
})

router.get('/retrieveBooksByCategory/:categoryName', async (req: Request, res: Response) => {
  const categoryName = req.params.categoryName
  try {
    const response = await bookController.getBooksByCategory(categoryName)
    res.status(response.code).json(response)
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Internal Server Error', error })
  }
})

export default router
