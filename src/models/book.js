module.exports = (connection, DataTypes) => {
  const schema = {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      allowEmpty: false,
      validate: {
        notNull: {
          args: [true],
          msg: 'Must provide a book title',
        },
        notEmpty: {
          args: [true],
          msg: 'The book title cannot be empty',
        },
      }
    },
    ISBN: {
      type: DataTypes.STRING,
    },
  };

  return connection.define('Book', schema);
};