import { Document, model, Schema, SchemaTypeOpts, SchemaTimestampsConfig, ObjectId } from 'mongoose';
import { categories, subcategories } from '../../../types';

export interface Article extends SchemaTimestampsConfig {
    _id: ObjectId | string;
    author: string;
    content: string;
    category: categories;
    subcategory: subcategories;
}

export type ArticleDocument = Article & Document;

const articleSchemaObj: Record<
    keyof Omit<Article, '_id' | keyof SchemaTimestampsConfig>,
    SchemaTypeOpts<any>
> = {
    author: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    category: { type: String, required: true },
    subcategory: { type: String, required: true }
};

const ArticleSchema: Schema = new Schema(articleSchemaObj);

const ArticleModel = model<ArticleDocument>('articles', ArticleSchema);

export default ArticleModel;
