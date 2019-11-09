const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;

let BookSchema = new Schema({
   name: {
      type: String,
      required: true
   },
   price: {
      type: Number,
      required: true
   },
   isbn: {
      type: Number
   }
}, {
      collection: 'books'
   });

BookSchema.plugin(AutoIncrement, { id:'book_seq', inc_field: 'isbn' });
const Book = mongoose.model('Book', BookSchema);
module.exports = {Book};