import { Order, Review } from '../models/models.js'

const userHasPlacedOrderInRestaurant = async (req, res, next) => {
  try {
    const numberOfRestaurantOrders = await Order.count({
      where: { restaurantId: req.params.restaurantId, userId: req.user.Id }
    })
    if (numberOfRestaurantOrders > 0) {
      return next()
    } else {
      return res.status(409).json({ error: 'User cannot review this restaurant without completed orders.' })
    }
  } catch (err) {
    return res.status(500).send(err.message)
  }
}

const checkCustomerHasNotReviewed = async (req, res, next) => {
  try {
    const reviewInRestaurant = await Review.findOne({
      where: { restaurantId: req.params.restaurantId, userId: req.user.Id }
    })
    if (reviewInRestaurant === 0) {
      return next()
    } else {
      return res.status(409).send('You already reviewed the restaurant.')
    }
  } catch (err) {
    return res.status(500).send(err.message)
  }
}

const checkReviewOwnership = async (req, res, next) => {
  const review = await Review.findByPk(req.params.reviewId)
  if (review.customerId !== req.user.id) {
    return res.status(403).json({ message: 'You do not have permission to modify this review.' })
  }
  next()
}

const checkReviewBelongsToRestaurant = async (req, res, next) => {
  const { restaurantId, reviewId } = req.params

  try {
    const review = await Review.findByPk(reviewId)

    // El comparador doble es intencionado por la diferencia de tipo de datos string vs integer
    // eslint-disable-next-line eqeqeq
    if (review.restaurantId != restaurantId) {
      return res.status(409).json({ error: 'Review does not belong to the specified restaurant.' })
    }

    next()
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export { checkCustomerHasNotReviewed, userHasPlacedOrderInRestaurant, checkReviewOwnership, checkReviewBelongsToRestaurant }
