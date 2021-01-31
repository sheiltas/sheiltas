import { Document, model, Schema, SchemaTypeOpts, SchemaTimestampsConfig, ObjectId } from 'mongoose';
import { encryptPasswordSync } from '../utils/auth';

export interface User extends SchemaTimestampsConfig {
    _id?: ObjectId | string;
    username: string;
    password?: string;
    fullName: string;
}

export type UserDocument = User & Document;

const userSchemaObj: Record<keyof Omit<User, '_id' | keyof SchemaTimestampsConfig>, SchemaTypeOpts<any>> = {
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        set: encryptPasswordSync,
        minlength: 8
    },
    fullName: {
        type: String,
        required: true
    }
};

const UserSchema: Schema = new Schema(userSchemaObj, { timestamps: true });

UserSchema.method('toJSON', function (this: UserDocument) {
    const user = this.toObject();
    delete user.password;
    return user;
});

const UserModel = model<UserDocument>('users', UserSchema);

export default UserModel;
