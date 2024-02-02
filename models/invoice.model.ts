import {mongoose} from "../utils/mongooseConfig"

const Schema = mongoose.Schema

const invoiceSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
})

const Invoice = mongoose.model('Invoice', invoiceSchema)

module.exports = Invoice
