import { Request, Response } from "express";
import knex from "./../database/connection";
import { PointModel } from "../interfaces/points.interface";

class PointController {
  async Create(request: Request, response: Response) {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      address,
      number,
      city,
      uf,
      items,
    } = request.body;

    const body = {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      address,
      number,
      city,
      uf,
      image: request.file.filename,
    };
    console.log(body);

    //const res = pointController.CreatePoints(body);

    const trx = await knex.transaction();

    const insertedPointIds = await trx("points").insert(body);

    const pointItems = items
      .split(",")
      .map((item: string) => Number(item.trim()))
      .map((item_id: number) => {
        return {
          item_id,
          point_id: insertedPointIds[0],
        };
      });

    const insertPointItems = await trx("point_items").insert(pointItems);

    await trx.commit();

    response.json({ id: insertedPointIds[0], ...body });
  }

  async Get(request: Request, response: Response) {
    const { id } = request.params;

    const point = await knex("points").where("id", id).first();

    if (!point) {
      return response.status(404).json({ message: `Point ${id} not found` });
    }

    const serializedPoint = {
      ...point,
      image_url: `http:localhost:3333/uploads/${point.image}`,
    };

    const items = await knex("items")
      .join("point_items", "items.id", "=", "point_items.item_id")
      .where("point_items.point_id", id)
      .select("items.title");

    return response.json({ serializedPoint, items });
  }

  async GetAll(request: Request, response: Response) {
    const { city, uf, items } = request.query;

    const parsedItems = String(items)
      .split(",")
      .map((item) => Number(item.trim()));

    const points = await knex("points")
      .join("point_items", "points.id", "=", "point_items.point_id")
      .whereIn("point_items.item_id", parsedItems)
      .where("city", String(city))
      .where("uf", String(uf))
      .distinct()
      .select("points.*");

    if (!points) {
      return response.status(404).json({ message: `Points not found` });
    }

    const serializedPoints = points.map((point) => {
      return {
        ...point,
        image_url: `http://localhost:3333/uploads/${point.image}`,
      };
    });

    return response.json({ serializedPoints });
  }

  async CreatePoints(body: PointModel) {
    return body;
  }
}

export default PointController;
