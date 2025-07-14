import { Model } from 'sequelize'

const loadModel = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate (models) {
      Review.belongsTo(models.Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' })
      Review.belongsTo(models.User, { foreignKey: 'userId', as: 'user' })
    }
  }

  Review.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    stars: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    body: {
      type: DataTypes.STRING
    },
    restaurantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: 'Restaurants'
        },
        key: 'id'
      },
      onDelete: 'cascade'
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: {
          tableName: 'Users'
        },
        key: 'id'
      }
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: new Date()
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: new Date()
    }
  }, {
    sequelize,
    modelName: 'Review'
  })

  return Review
}

export default loadModel
