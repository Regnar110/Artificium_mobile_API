export const redisConfig = () => ({
  port: process.env.REDIS_PORT as unknown as number,
  host: process.env.REDIS_HOST,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
});
