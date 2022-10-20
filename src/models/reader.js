module.exports = (connection, DataTypes) => {
  const schema = {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8]
      }
    },
  };

  const scope = {
    defaultScope: {
      attributes: { exclude: ['password'] },
    }
  }

  const ReaderModel = connection.define('Reader', schema, scope);
  return ReaderModel;
};