import express from 'express';
import 'dotenv/config';

const app = express();
const PORT_SERVER = process.env.PORT_SERVER;

app.listen(PORT_SERVER, () => {
  console.log(`Server is running on port ${PORT_SERVER}`);
});