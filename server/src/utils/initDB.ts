// Init locales
import { readFile } from 'fs';
import { join } from 'path';
import { baseCategoriesKeysArray, languages } from '../../../client/src/utils';
import { categoriesKeys, Category, Locale } from '../../../client/src/types';
import LocaleModel from '../models/locals';
import SheiltaModel from '../models/sheilta';
import CategoryModel from '../models/category';

export const initLocales = () =>
    readFile(
        join(__dirname, '../../../resources/localesData.json'),
        { encoding: 'utf-8' },
        async (err, data) => {
            if (err) {
                return console.error('err', err);
            }
            const localesData = JSON.parse(data);
            const formattedData = Object.keys(localesData.en).map((key) => ({
                key,
                translation: languages.reduce((acc, language) => {
                    acc[language] = localesData[language][key];
                    return acc;
                }, {} as Locale['translation'])
            }));

            // @ts-ignore
            const localesRes = await LocaleModel.insertMany(formattedData);

            console.log('Initiated locales successfully');
            const categories = localesRes.reduce((acc, locale) => {
                const { key, _id: localeId } = locale;
                return baseCategoriesKeysArray.includes(key as categoriesKeys)
                    ? acc.concat(
                          new CategoryModel({
                              name: localeId,
                              subcategories: []
                          })
                      )
                    : acc;
            }, [] as Category[]);

            await Promise.all([
                // @ts-ignore _id will be created in mongo
                LocaleModel.insertMany(formattedData),
                CategoryModel.insertMany(categories).then(async (categoriesRes) => {
                    await 
                })
            ]);

            console.log('Initiated categories successfully');
        }
    );

export const initSheiltas = () =>
    readFile(join(__dirname, '../../resources/initSheiltas.json'), { encoding: 'utf-8' }, (err, data) => {
        if (err) {
            return console.error('err', err);
        }
        SheiltaModel.insertMany(JSON.parse(data)).then(() => console.log('Initiated sheiltas successfully'));
    });
