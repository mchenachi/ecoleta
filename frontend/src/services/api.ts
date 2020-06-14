import axios from "axios";

export interface PointContent {
  name: string;
  email: string;
  whatsapp: number;
  uf: string;
  city: string;
  latitude: number;
  longitude: number;
  items: number[];
  address: string;
  number: number;
  image?: File;
}

const api = axios.create({
  baseURL: "http://localhost:3333",
});

export const getCollectTypes = async () => {
  return await api
    .get("/items")
    .then((res) => {
      return res.data;
    })
    .catch((err) => console.log(err));
};

export const postPoint = async (body: FormData) => {
  return await api
    .post(`/points`, JSON.stringify(body), {
      headers: {
        "Content-type": "application/json",
      },
    })
    .then((res) => res)
    .catch((err) => console.log(err));
};
