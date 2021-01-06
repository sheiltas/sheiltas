import * as express from 'express';
import * as helmet from 'helmet';
import * as mongoose from 'mongoose';

import * as morgan from 'morgan';
import * as cors from 'cors';

import routes from './routes';

import ArticleModel from './models/articles';
import SheiltaModel from './models/sheilta';

// Remove in production
import * as path from 'path';
import * as fs from 'fs';

const dbUrl = process.env.DB_URL;

const port = process.env.PORT;

const sitePath = path.join(__dirname, process.env.NODE_ENV === 'production' ? '../../../build' : '../build');

const app = express();

app.use(cors());
app.use(morgan('dev'));

app.use(helmet());

app.use(express.json({ limit: '100mb' }), express.urlencoded({ extended: false }));

app.use('/api', routes);

app.use(express.static(sitePath));

app.get('/', (req, res) => {
    res.set(
        'Content-Security-Policy',
        "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'"
    );
    res.sendFile(path.join(sitePath, 'index.html'));
});
console.log('NODE_ENV', process.env.NODE_ENV);
app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);

    try {
        await mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to DB', process.env.NODE_ENV === 'development' && dbUrl);

        // Init DB remove in production
        // const initSheiltas = fs.readFileSync(
        //     path.resolve(__dirname, '../../resources/initSheiltas.json'),
        //     'utf-8'
        // );
        // await SheiltaModel.insertMany(JSON.parse(initSheiltas));
        // console.log('Inserted Sheiltas successfully');
    } catch (e) {
        console.log('e', e);
    }
});
