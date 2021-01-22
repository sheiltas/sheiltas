import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import morgan from 'morgan';
import { join, resolve } from 'path';
import compression from 'compression';

import cors from 'cors';

import routes from './routes/index';
import { initDB } from './utils/initDB';

import { RequestHandler } from 'express';
import { readFile } from 'fs';

import App from '../../client/src/App';

// import * as React, react from 'react';
import React, { createElement } from 'react';

import * as ReactDOMServer from 'react-dom/server';

const serverRenderer: RequestHandler = (req, res, next) => {
    const filePath = resolve(__dirname, '..', 'build', 'index.html');

    readFile(filePath, 'utf8', (err, htmlData) => {
        if (err) {
            console.error('err', err);
            return res.status(404).end();
        }

        // render the app as a string
        const html = ReactDOMServer.renderToString(<App />);
        console.log('html', html);
        //
        // inject the rendered app into our html and send it
        return res.send(htmlData.replace('<div id="root"></div>', `<div id="root">${html}</div>`));
    });
};

const isProduction = process.env.NODE_ENV === 'production';

const dbUrl = process.env.DB_URL;

const port = process.env.PORT;

mongoose.set('useCreateIndex', true);

const sitePath = join(__dirname, isProduction ? '../../../build' : '../build');

const app = express();

if (!isProduction) {
    app.use(cors());
}

app.use(morgan('dev'));

app.use(helmet());

app.use(compression());

app.use(express.json({ limit: '60mb' }), express.urlencoded({ extended: false }));

app.use('/api', routes);

app.use('^/$', serverRenderer);

app.use(express.static(sitePath));

app.get('/', (req, res) => {
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
        await mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to DB', isProduction ? '' : dbUrl);

        await initDB();

        // initSheiltas();
    } catch (e) {
        console.error('Error:', e);
    }
});
