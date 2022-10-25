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
      unique: {
        args: true,
        msg: 'ISBN must be unique'
      },
      validate: {
        is: {
          args: /^(?:ISBN(?:-1[03])?:?)?(?=[0-9X]{10}$|(?=(?:[0-9]+[-]){3})[-0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[-]){4})[-0-9]{17}$)(?:97[89][-]?)?[0-9]{1,5}[-]?[0-9]+[-]?[0-9]+[-]?[0-9X]$/gm,
          msg: 'ISBN must be of valid format'
        }
      }
    },
  };

  const scope = {
    defaultScope: {
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    }
  };

  return connection.define('Book', schema, scope);
};