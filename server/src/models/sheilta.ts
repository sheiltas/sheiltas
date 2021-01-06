import { model, SchemaTimestampsConfig, ObjectId, Document, SchemaTypeOpts, Schema } from 'mongoose';
import { categoriesKeys, subcategoriesHebrew } from '../../../client/src/types';

export interface Sheilta extends SchemaTimestampsConfig {
    _id: ObjectId | string;
    author?: string;
    title: string;
    question: string;
    answer: string;
    category: categoriesKeys;
    subcategory: subcategoriesHebrew;
}

export type SheiltaDocument = Sheilta & Document;

const sheiltaSchemaObj: Record<
    keyof Omit<Sheilta, '_id' | keyof SchemaTimestampsConfig>,
    SchemaTypeOpts<any>
> = {
    author: { type: String, required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    subcategory: {
        type: String
        // Should be required when all categories have subcategories
        // required: true
    }
};

const SheiltaSchema = new Schema(sheiltaSchemaObj, { timestamps: true });

const Model = model<SheiltaDocument>('sheiltas', SheiltaSchema);

export default Model;
