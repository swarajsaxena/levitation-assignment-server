const { Schema } = require("mongoose")

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  },
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product
