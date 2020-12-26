import { model, SchemaTimestampsConfig, ObjectId, Document, SchemaTypeOpts, Schema } from 'mongoose';
import { categories, subcategories } from '../../../types';

export interface Sheilta extends SchemaTimestampsConfig {
    _id: ObjectId | string;
    answerBy?: string;
    title: string;
    question: string;
    answer: string;
    category: categories;
    subcategory: subcategories;
}

export type SheiltaDocument = Sheilta & Document;

const sheiltaSchemaObj: Record<
    keyof Omit<Sheilta, '_id' | keyof SchemaTimestampsConfig>,
    SchemaTypeOpts<any>
> = {
    answerBy: String,
    category: String,
    question: String,
    answer: String,
    title: String,
    subcategory: String
};

const SheiltaSchema = new Schema(sheiltaSchemaObj, { timestamps: true });

const Model = model<SheiltaDocument>('sheiltas', SheiltaSchema);

export default Model;
