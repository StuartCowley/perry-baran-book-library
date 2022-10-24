const { faker } = require('@faker-js/faker');

exports.readerFactory = (data = {}) => {
  const { name, email, password } = data;

  return {
    name: name !== undefined ? name : faker.name.fullName(),
    email: email !== undefined ? email : faker.helpers.unique(faker.internet.email),
    password: password !== undefined ? password : faker.internet.password(8)
  };
};

exports.bookFactory = (data = {}) => {
  const { title, ISBN, authorId, genreId } = data;

  const generateISBN13 = () => {
    const eightOrNine = () => Math.floor(Math.random() * 2 + 8);
    const randomNum = (length) => faker.random.numeric(length, { allowLeadingZeros: true });

    return `97${eightOrNine()}-${randomNum(1)}-${randomNum(4)}-${randomNum(4)}-${randomNum(1)}`
  };

  return {
    title: title !== undefined ? title : faker.lorem.word(),
    ISBN: ISBN !== undefined ? ISBN : generateISBN13(),
    AuthorId: authorId,
    GenreId: genreId
  };
};

exports.authorFactory = (author) => {
  return {
    author: author !== undefined ? author : faker.helpers.unique(faker.name.fullName)
  };
};

exports.genreFactory = (genre) => {
  return {
    genre: genre !== undefined ? genre : faker.helpers.unique(faker.lorem.words)
  };
};