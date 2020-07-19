import express from 'express'

import PointsController from './controllers/pointsController'
import ItemsController from './controllers/itemsController'

const routes = express.Router()

const IndexItemsController = ItemsController()
const { createPoint, showPoint, indexPoint } = PointsController()

// ITEMS
routes.get('/items', IndexItemsController)

// POINTS
routes.get('/points', indexPoint)
routes.get('/points/:id', showPoint)
routes.post('/points', createPoint)

export default routes