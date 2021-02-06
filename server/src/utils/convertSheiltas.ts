import { readFile } from 'fs';
import { join } from 'path';
import SheiltaModel from '../models/sheilta';
import CategoryModel from '../models/category';
import { Locale, Subcategory } from '../../../client/src/types';

const convertSheiltas = async () => {
    const categories = await CategoryModel.find({})
        .lean()
        .populate([
            {
                path: 'name'
            },
            {
                path: 'subcategories',
                populate: {
                    path: 'name'
                }
            }
        ]);

    readFile(join(__dirname, '../../resources/initSheiltas.json'), { encoding: 'utf-8' }, (err, data) => {
        if (err) {
            return console.error('err', err);
        }

        const parsedData = JSON.parse(data);
        const formattedData = parsedData.map((singleData: any) => ({
            ...singleData,
            category: categories.find(
                (category) => (category.name as Locale).translation.he === singleData.category
            )?._id,
            subcategory: categories
                .find((category) => (category.name as Locale).translation.he === singleData.category)
                ?.subcategories?.find(
                    (subcategory: Subcategory) =>
                        (subcategory.name as Locale).translation.he === singleData.subCategory
                    // @ts-ignore
                )?._id
        }));
        SheiltaModel.insertMany(formattedData).then(() => console.log('Initiated sheiltas successfully'));
    });
};

export default convertSheiltas;
