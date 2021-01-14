import { readFile } from 'fs';
import { join } from 'path';
import {
    baseCategoriesKeysArray,
    languages,
    mapCategoriesKeysToHebrewSubcategories
} from '../../../client/src/utils';
import { categoriesKeys, Category, Locale, subcategoriesHebrew } from '../../../client/src/types';
import LocaleModel from '../models/locals';
import SheiltaModel from '../models/sheilta';
import CategoryModel from '../models/category';
import SubcategoryModel from '../models/subcategory';
import UserModel from '../models/users';

export const initDB = async () => {
    const adminExists = await UserModel.findOne({ username: 'admin' });
    if (adminExists) {
        console.log('DB already exists');
        return;
    }

    readFile(
        join(__dirname, '../../../resources/localesData.json'),
        { encoding: 'utf-8' },
        async (err, data) => {
            if (err) {
                return console.error('err', err);
            }
            const localesData = JSON.parse(data);
            const locales = Object.keys(localesData.en).map(
                (key) =>
                    new LocaleModel({
                        key,
                        translation: languages.reduce((acc, language) => {
                            acc[language] = localesData[language][key];
                            return acc;
                        }, {} as Locale['translation'])
                    })
            );

            const subcategories = locales.reduce((acc, locale) => {
                const { _id: localeId, translation } = locale;
                const hebrewName = Object.values(mapCategoriesKeysToHebrewSubcategories).find((value) =>
                    value.includes(translation.he as subcategoriesHebrew)
                );
                return hebrewName
                    ? acc.concat(
                          new SubcategoryModel({
                              name: localeId,
                              subcategories: []
                          })
                      )
                    : acc;
            }, []);

            const categories = locales.reduce((acc, locale) => {
                const { key, _id: localeId } = locale;
                const isCategory = baseCategoriesKeysArray.includes(key as categoriesKeys);
                return isCategory
                    ? acc.concat(
                          new CategoryModel({
                              name: localeId,
                              subcategories: mapCategoriesKeysToHebrewSubcategories[key as categoriesKeys]
                                  .map((heSubcategory) =>
                                      locales.find(
                                          (singleLocale) => singleLocale.translation.he === heSubcategory
                                      )
                                  )
                                  .map((subcategoryLocale) =>
                                      subcategories.find(
                                          (subcategory) => subcategory.name === subcategoryLocale._id
                                      )
                                  )
                          })
                      )
                    : acc;
            }, [] as Category[]);

            try {
                await Promise.all([
                    LocaleModel.insertMany(locales),
                    CategoryModel.insertMany(categories),
                    SubcategoryModel.insertMany(subcategories),
                    UserModel.create({ fullName: 'Full name', password: '0000', username: 'admin' })
                ]);
                console.log('Initiated DB successfully');
            } catch (e) {
                console.log('Error in init DB:', e);
            }
        }
    );
};

export const initSheiltas = () =>
    readFile(join(__dirname, '../../resources/initSheiltas.json'), { encoding: 'utf-8' }, (err, data) => {
        if (err) {
            return console.error('err', err);
        }
        SheiltaModel.insertMany(JSON.parse(data)).then(() => console.log('Initiated sheiltas successfully'));
    });
