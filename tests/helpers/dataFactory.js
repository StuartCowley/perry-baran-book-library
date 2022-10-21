const { faker } = require('@faker-js/faker');

exports.readerFactory = (data = {}) => {
  const { name, email, password } = data;

  return {
    name: name !== undefined ? name : faker.lorem.word(),
    email: email !== undefined ? email : faker.helpers.unique(faker.internet.email),
    password: password !== undefined ? password : faker.internet.password(8)
  };
};

exports.bookFactory = (data = {}) => {
  const { title, author, genreId, ISBN } = data;

  return {
    title: title !== undefined ? title : faker.lorem.word(),
    author: author !== undefined ? author : faker.lorem.word(),
    ISBN: ISBN !== undefined ? ISBN : faker.random.numeric(13),
    GenreId: genreId
  };
};

exports.authorFactory = (author) => {
  return {
    author: author !== undefined ? author : faker.helpers.unique(faker.lorem.word)
  };
};

exports.genreFactory = (genre) => {
  return {
    genre: genre !== undefined ? genre : faker.helpers.unique(faker.lorem.word)
  };
};