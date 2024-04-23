import mongoose from "mongoose"

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    categories: {
        name: { type: String, required: true },
    }, 
}, { collection: "books" })

const BookModel = mongoose.model("Book", bookSchema)

export default BookModel
