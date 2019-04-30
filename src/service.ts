import got from 'got';


export async function getDoodle() {
    try {
        const response = await got('https://google.com/doodle.png');
        return [null, JSON.parse(response.body)];
    } catch (error) {
        return [error];
    }
};
