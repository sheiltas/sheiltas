import * as express from 'express';
import * as helmet from 'helmet';
import * as mongoose from 'mongoose';
import routes from './routes';

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/myapp';

const port = process.env.PORT || '3000';

const app = express();

app.use(helmet());

app.use(express.json({ limit: '1000mb' }), express.urlencoded({ extended: false }));

routes.forEach((route) => app.use(route));

app.get('/', (req, res) => {
    res.send('herro world!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
        console.log('Connected to DB');
    });
});
