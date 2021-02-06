import { Document, model, Schema, SchemaTypeOpts } from 'mongoose';
import { Category } from '../../../client/src/types';
import SubcategoryModel from './subcategory';
import LocaleModel from './locals';

export type CategoryDocument = Category & Document;

const categorySchemaObj: Record<keyof Omit<Category, '_id'>, SchemaTypeOpts<any>> = {
    name: {
        type: Schema.Types.ObjectId,
        ref: LocaleModel,
        required: true,
        unique: true
    },
    subcategories: [
        {
            type: Schema.Types.ObjectId,
            ref: SubcategoryModel,
            default: []
        }
    ]
};

const CategorySchema: Schema = new Schema(categorySchemaObj);

const CategoryModel = model<CategoryDocument>('categories', CategorySchema);

export default CategoryModel;
