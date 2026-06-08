import express from "express";
import "dotenv/config";
import geminiRouter from "./agent/gemini.service.js";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(geminiRouter);
app.use(cors());
const PORT_SERVER = Number(process.env.PORT_SERVER);

app.listen(PORT_SERVER, () => {
  console.log(`port ${PORT_SERVER}`);
});
