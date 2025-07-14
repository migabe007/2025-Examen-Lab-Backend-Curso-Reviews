import ReviewController from '../controllers/ReviewController.js'
import * as ReviewValidation from '../controllers/validation/ReviewValidation.js'
import { isLoggedIn, hasRole } from '../middlewares/AuthMiddleware.js'
import { handleValidation } from '../middlewares/ValidationHandlingMiddleware.js'
import { checkEntityExists } from '../middlewares/EntityMiddleware.js'
import { Restaurant, Review } from '../models/models.js'
import { userHasPlacedOrderInRestaurant, checkReviewOwnership, checkReviewBelongsToRestaurant, checkCustomerHasNotReviewed } from '../middlewares/ReviewMiddleware.js'
import ProductController from '../controllers/ProductController.js'

const loadReviewRoutes = function (app) {
  app.route('/restaurants/:restaurantId/reviews')
    .get(
      isLoggedIn(),
      checkEntityExists(Review, 'reviewId'),
      ReviewController.index)
    .post(
      isLoggedIn(),
      hasRole('customer'),
      checkEntityExists(Restaurant, 'restaurantId'),
      userHasPlacedOrderInRestaurant,
      checkCustomerHasNotReviewed,
      ReviewValidation.create,
      handleValidation,
      ReviewController.create
    )
  app.route('/restaurants/:restaurantId/reviews/:reviewId')
    .put(
      isLoggedIn(),
      hasRole('customer'),
      checkReviewOwnership,
      checkEntityExists(Restaurant, 'restaurantId'),
      checkEntityExists(Review, 'reviewId'),
      checkReviewBelongsToRestaurant,
      ReviewValidation.update,
      handleValidation,
      ReviewController.update
    )
    .delete(
      isLoggedIn(),
      hasRole('customer'),
      checkReviewOwnership,
      checkEntityExists(Restaurant, 'restaurantId'),
      checkEntityExists(Review, 'reviewId'),
      checkReviewBelongsToRestaurant,
      ProductController.destroy
    )
}

export default loadReviewRoutes
