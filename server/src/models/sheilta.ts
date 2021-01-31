import { model, SchemaTimestampsConfig, Document, SchemaTypeOpts, Schema } from 'mongoose';
import { Sheilta } from '../../../client/src/types';
import CategoryModel from './category';
import SubcategoryModel from './subcategory';
import UserModel from './users';

export type SheiltaDocument = Sheilta & Document;

const sheiltaSchemaObj: Record<
    keyof Omit<Sheilta, '_id' | keyof SchemaTimestampsConfig>,
    SchemaTypeOpts<any>
> = {
    author: {
        type: Schema.Types.ObjectId,
        ref: UserModel,
        index: true,
        required: true
    },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    title: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: CategoryModel, required: true },
    subcategory: {
        type: Schema.Types.ObjectId,
        ref: SubcategoryModel
        // Should be required when all categories have subcategories
        // required: true
    }
};

const SheiltaSchema = new Schema(sheiltaSchemaObj, { timestamps: true });

const Model = model<SheiltaDocument>('sheiltas', SheiltaSchema);

export default Model;
