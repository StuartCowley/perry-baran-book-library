const { faker } = require('@faker-js/faker');

exports.readerFactory = (data = {}) => {
  const { name, email, password } = data;

  return {
    name: name || faker.lorem.word(),
    email: email || faker.helpers.unique(faker.internet.email),
    password: password || faker.internet.password(8)
  };
};

exports.bookFactory = (data = {}) => {
  const { title, author, genre, ISBN } = data;

  return {
    title: title || faker.lorem.word(),
    author: author || faker.lorem.word(),
    genre: genre || faker.lorem.word(),
    ISBN: ISBN || faker.random.numeric(13)
  };
};

exports.authorFactory = (author) => {
  return {
    author: author || faker.helpers.unique(faker.lorem.word)
  };
};

exports.genreFactory = (genre) => {
  return {
    genre: genre || faker.helpers.unique(faker.lorem.word)
  };
};