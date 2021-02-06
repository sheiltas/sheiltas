import * as express from 'express';
import * as helmet from 'helmet';
import * as mongoose from 'mongoose';
import * as morgan from 'morgan';
import { join } from 'path';
import * as compression from 'compression';

import * as cors from 'cors';

import routes from './routes/index';
import { initDB, updateLocals } from './utils/initDB';

const isProduction = process.env.NODE_ENV === 'production';

const dbUrl = process.env.DB_URL;

const port = process.env.PORT;

mongoose.set('useCreateIndex', true);

const sitePath = join(__dirname, isProduction ? '../../../build' : '../build');
console.log('sitePath', sitePath);
const app = express();

if (!isProduction) {
    app.use(cors());
}

app.use(morgan('dev'));

app.use(helmet());

app.use(compression());

app.use(express.json({ limit: '60mb' }), express.urlencoded({ extended: false }));

app.use('/api', routes);

app.use(express.static(sitePath));

app.get('/*', (req, res) => {
    res.set(
        'Content-Security-Policy',
        "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'"
    );
    res.sendFile(join(sitePath, 'index.html'));
});

console.log('NODE_ENV', process.env.NODE_ENV);

app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);

    try {
        await mongoose.connect(dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
        console.log('Connected to DB', isProduction ? '' : dbUrl);

        if (!isProduction) {
            const initiated = await initDB();
            if (!initiated) {
                await updateLocals();
            }
        }
    } catch (e) {
        console.error('Error:', e);
    }
});
