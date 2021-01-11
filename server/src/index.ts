import * as express from 'express';
import * as helmet from 'helmet';
import * as mongoose from 'mongoose';
import * as morgan from 'morgan';
import * as path from 'path';

import * as cors from 'cors';

import * as fs from 'fs';
// import localesData from '../../client/src/resources/localesData.json';
import routes from './routes';
import { languages } from '../../client/src/utils';
import { Locale } from '../../client/src/types';
import LocaleModel from './models/locals';
import SheiltaModel from './models/sheilta';
import ArticleModel from './models/articles';

const isProduction = process.env.NODE_ENV === 'production';

const dbUrl = process.env.DB_URL;

const port = process.env.PORT;

mongoose.set('useCreateIndex', true);

const sitePath = path.join(__dirname, isProduction ? '../../../build' : '../build');

const app = express();

if (!isProduction) {
    app.use(cors());
}

app.use(morgan('dev'));

app.use(helmet());

app.use(express.json({ limit: '60mb' }), express.urlencoded({ extended: false }));

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
        console.log('Connected to DB', isProduction ? '' : dbUrl);

        // Init locales
        // fs.readFile(
        //     path.join(__dirname, '../../client/src/resources/localesData.json'),
        //     { encoding: 'utf-8' },
        //     (err, data) => {
        //         if (err) {
        //             return console.error('err', err);
        //         }
        //         const localesData = JSON.parse(data);
        //         const formattedData = Object.keys(localesData.en).map((key) => ({
        //             key,
        //             translation: languages.reduce((acc, language) => {
        //                 // @ts-ignore
        //                 acc[language] = localesData[language][key];
        //                 return acc;
        //             }, {} as Locale['translation'])
        //         }));
        //         console.log('formattedData', formattedData);
        //         // @ts-ignore
        //         LocaleModel.insertMany(formattedData);
        //     }
        // );

        // Init sheiltas
        // const initSheiltas = fs.readFileSync(
        //     path.resolve(__dirname, '../../resources/initSheiltas.json'),
        //     'utf-8'
        // );
        // await SheiltaModel.insertMany(JSON.parse(initSheiltas));
        // console.log('Inserted Sheiltas successfully');
    } catch (e) {
        console.error('Error:', e);
    }
});
