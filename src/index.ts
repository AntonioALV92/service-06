import app from './app';
const port: number = Number(process.env.PORT) || 8080;
app.listen(port, () => {
    console.info(`Listening on port: ${port}`);
});
