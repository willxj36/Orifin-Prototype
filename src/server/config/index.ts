import * as dotenv from 'dotenv';

dotenv.config();

export default require(`./${process.env.NODE_ENV}`).default;