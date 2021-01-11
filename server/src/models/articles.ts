import { Document, model, Schema, SchemaTypeOpts, SchemaTimestampsConfig } from 'mongoose';
import UserModel from './users';
import { Article } from '../../../client/src/types';

export type ArticleDocument = Article & Document;

const articleSchemaObj: Record<
    keyof Omit<Article, '_id' | keyof SchemaTimestampsConfig>,
    SchemaTypeOpts<any>
> = {
    author: {
        type: Schema.Types.ObjectId,
        ref: UserModel,
        index: true,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    category: { type: String, required: true },
    subcategory: {
        type: String
        // required: true
    }
};

const ArticleSchema: Schema = new Schema(articleSchemaObj, { timestamps: true });

const ArticleModel = model<ArticleDocument>('articles', ArticleSchema);

export default ArticleModel;
