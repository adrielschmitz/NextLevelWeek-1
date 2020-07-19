import { Request, Response } from 'express'
import knex from '../database/connection'

const default_url = 'http://192.168.31.84:3333/uploads/'

const ItemsController = () => {
  return async (request: Request, response: Response) => {
    const items = await knex('items').select('*')
    const serialized_items = items.map(item => {
      return {
        id: item.id,
        title: item.title,
        image_url: default_url + item.image,
      }
    })
    return response.json(serialized_items)
  }
}

export default ItemsController