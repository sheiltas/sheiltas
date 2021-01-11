import { Document, model, Schema, SchemaTypeOpts } from 'mongoose';
import { Locale } from '../../../client/src/types';
import { languages } from '../../../client/src/utils';

export type LocaleDocument = Locale & Document;

const localeSchemaObj: Record<keyof Omit<Locale, '_id'>, SchemaTypeOpts<any>> = {
    key: { type: String, required: true, unique: true },
    translation: languages.reduce((acc, language) => {
        acc[language] = { type: String, required: true };
        return acc;
    }, {} as any)
};

const LocaleSchema: Schema = new Schema(localeSchemaObj);

const LocaleModel = model<LocaleDocument>('locales', LocaleSchema);

export default LocaleModel;
