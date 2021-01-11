import { Document, model, Schema, SchemaTypeOpts } from 'mongoose';
import { Subcategory } from '../../../client/src/types';
import CategoryModel from './category';
import LocaleModel from './locals';

export type SubcategoryDocument = Subcategory & Document;

console.log('CategoryModel', CategoryModel);

const subcategorySchemaObj: Record<keyof Omit<Subcategory, '_id'>, SchemaTypeOpts<any>> = {
    name: {
        type: Schema.Types.ObjectId,
        ref: LocaleModel,
        required: true,
        unique: true
    }
    // category: {
    //     type: Schema.Types.ObjectId,
    //     ref: CategoryModel,
    //     required: true
    // }
};

const SubcategorySchema: Schema = new Schema(subcategorySchemaObj);

const SubcategoryModel = model<SubcategoryDocument>('subcategories', SubcategorySchema);

export default SubcategoryModel;
