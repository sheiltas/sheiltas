// Init locales
import { readFile } from 'fs';
import { join } from 'path';
import { languages } from '../../../client/src/utils';
import { Locale } from '../../../client/src/types';
import LocaleModel from '../models/locals';
import SheiltaModel from '../models/sheilta';

export const initLocales = () =>
    readFile(join(__dirname, '../../../resources/localesData.json'), { encoding: 'utf-8' }, (err, data) => {
        if (err) {
            return console.error('err', err);
        }
        const localesData = JSON.parse(data);
        const formattedData = Object.keys(localesData.en).map((key) => ({
            key,
            translation: languages.reduce((acc, language) => {
                // @ts-ignore
                acc[language] = localesData[language][key];
                return acc;
            }, {} as Locale['translation'])
        }));

        // @ts-ignore
        LocaleModel.insertMany(formattedData).then(() => console.log('Initiated locales successfully'));
    });

export const initSheiltas = () =>
    readFile(join(__dirname, '../../resources/initSheiltas.json'), { encoding: 'utf-8' }, (err, data) => {
        if (err) {
            return console.error('err', err);
        }
        SheiltaModel.insertMany(JSON.parse(data)).then(() => console.log('Initiated sheiltas successfully'));
    });
