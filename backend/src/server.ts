import express, { response } from "express";
import { errors } from "celebrate";
import cors from "cors";
import path from "path";
import routes from "./routes";

const app = express();

// enable cors
app.use(cors());

// to understand requests body
app.use(express.json());

// call routes
app.use(routes);

// gets image by /uploads/imgname.extension
app.use("/uploads", express.static(path.resolve(__dirname, "..", "uploads")));

// handle errors
app.use(errors());

app.listen(3333);
