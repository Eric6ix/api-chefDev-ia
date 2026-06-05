import express from "express";
import "dotenv/config";
import geminiRouter from "./agent/gemini.service.js";
const app = express();
app.use(express.json());
app.use(geminiRouter);
const PORT_SERVER = Number(process.env.PORT_SERVER);
app.listen(PORT_SERVER, () => {
    console.log(`Server is running on port ${PORT_SERVER}`);
});
