import app from './app';
const port: number = Number(process.env.PORT) || 3000;
app.listen(port, () => console.log(`Live at ${port}`));