import app from './app';
const port: number = Number(process.env.PORT) || 3000;
app.listen(port, () => {
    console.info(`Listening on port: ${port}`);
});
