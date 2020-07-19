import express from 'express'

import PointsController from './controllers/pointsController'
import ItemsController from './controllers/itemsController'

const routes = express.Router()

const IndexItemsController = ItemsController()
const pointsController = PointsController()

// ITEMS
routes.get('/items', IndexItemsController)

// POINTS
routes.get('/points', pointsController.index)
routes.get('/points/:id', pointsController.show)
routes.post('/points', pointsController.create)
routes.delete('/points/:id', pointsController.destroy)

export default routes