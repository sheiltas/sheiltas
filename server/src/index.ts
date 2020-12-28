import * as express from 'express';
import * as helmet from 'helmet';
import * as mongoose from 'mongoose';
import routes from './routes';

import ArticleModel from './models/articles';
import SheiltaModel from './models/sheilta';

// Remove in production
import * as path from 'path';
import * as fs from 'fs';

const dbUrl = process.env.DB_URL;

const port = process.env.PORT;

const app = express();

app.use(helmet());

app.use(express.json({ limit: '1000mb' }), express.urlencoded({ extended: false }));

app.use('/api', routes);

app.get('/', (req, res) => {
    res.send('herro world!');
});

app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);

    try {
        await mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to DB');

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
