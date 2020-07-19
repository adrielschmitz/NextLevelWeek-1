import { Request, Response } from 'express'
import knex from '../database/connection'

const PointsController = () => {
  const index = async (request: Request, response: Response) => {
    const { city, uf, items } = request.query

    const parsed_items = String(items)
      .split(',')
      .map(item => Number(item.trim()))

    const points = await knex('points')
      .join('point_items', 'points.id', '=', 'point_items.point_id')
      .select('points.*')
      .where('city', String(city))
      .where('uf', String(uf))
      .whereIn('point_items.item_id', parsed_items)
      .distinct()

    return response.json(points)
  }

  const findById = async (id: string) => knex('points').where('id', id).first()

  const show = async (request: Request, response: Response) => {
    const { id } = request.params
    const point = await findById(id)

    if (!point) {
      return response.status(400).json({ message: 'Point not found' })
    }

    const items = await knex('items')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', id)
      .select('items.title')

    return response.json({ point, items })
  }

  const create = async (request: Request, response: Response) => {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items,
    } = request.body

    const point = {
      image: 'image-fake',
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
    }

    // variavel para garantir uma operação atomica
    const trx = await knex.transaction()

    const inserted_ids = await trx('points').insert(point)

    const point_id = inserted_ids[0]

    const point_items = items.map((item_id: number) => {
      return {
        item_id,
        point_id: point_id,
      }
    })

    await trx('point_items').insert(point_items)

    await trx.commit()

    return response.json({ id: point_id, ...point })
  }

  const destroy = async (request: Request, response: Response) => {
    const { id } = request.params
    const point = await findById(id)

    console.log(point)

    return response.json({ status: 200 })
  }

  return {
    createPoint: create,
    showPoint: show,
    indexPoint: index,
    deletePoint: destroy,
  }
}

export default PointsController