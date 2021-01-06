import { Document, model, Schema, SchemaTypeOpts, SchemaTimestampsConfig, ObjectId } from 'mongoose';
import { categoriesKeys, subcategoriesHebrew } from '../../../client/src/types';
import UserModel, { User } from './users';

export interface Article extends SchemaTimestampsConfig {
    _id: ObjectId | string;
    author: ObjectId | User;
    content: string;
    category: categoriesKeys;
    subcategory: subcategoriesHebrew;
}

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

const ArticleSchema: Schema = new Schema(articleSchemaObj);

const ArticleModel = model<ArticleDocument>('articles', ArticleSchema);

export default ArticleModel;
