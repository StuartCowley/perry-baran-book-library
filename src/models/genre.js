module.exports = (sequelize, DataTypes) => {
  const schema = {
    genre: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: 'The genre must be unique'
      },
      allowNull: false,
      allowEmpty: false,
      validate: {
        notNull: {
          args: [true],
          msg: 'Must provide a genre',
        },
        notEmpty: {
          args: [true],
          msg: 'The genre cannot be empty',
        }
      },
    },
  };

  return sequelize.define('Genre', schema);
};