const DataLoader = require('dataloader');
const Book = require('./models/book');


const bookCountLoader = new DataLoader(async (authorIds) => {

  const books = await Book.find({ author: { $in: authorIds } });
  const bookCountMap = {};
  authorIds.forEach(id => bookCountMap[id] = 0);
  books.forEach(book => bookCountMap[book.author] += 1);

  return authorIds.map(id => bookCountMap[id]);
});

module.exports = {
  bookCountLoader
};