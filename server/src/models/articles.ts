import { Document, model, Schema, SchemaTypeOpts, SchemaTimestampsConfig } from 'mongoose';
import UserModel from './users';
import { Article } from '../../../client/src/types';
import CategoryModel from './category';
import SubcategoryModel from './subcategory';

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
    category: { type: Schema.Types.ObjectId, ref: CategoryModel, required: true },
    subcategory: {
        type: Schema.Types.ObjectId,
        ref: SubcategoryModel
        // required: true - should be true when all categories will have subcategories
    }
};

const ArticleSchema: Schema = new Schema(articleSchemaObj, { timestamps: true });

const ArticleModel = model<ArticleDocument>('articles', ArticleSchema);

export default ArticleModel;
