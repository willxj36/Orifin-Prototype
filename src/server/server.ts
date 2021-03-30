import * as express from 'express';
import routes from './routes';
import * as cors from 'cors';
import * as path from 'path';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import * as passport from 'passport';
import './middleware/bearerstrategy';
import './middleware/localstrategy';

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.json());
app.use(passport.initialize());
app.use(routes);
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../public/index.html')))

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port: ${port}`)).on('error', err => {
    console.log(err);
    process.exit(1);
});
