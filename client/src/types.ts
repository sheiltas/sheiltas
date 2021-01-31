import { ReactNode } from 'react';
import { languages as languagesArray } from './utils';

// Models - all _id's are mongoose.ObjectId in the server
export interface User extends SchemaTimestampsConfig {
  _id: string;
  username: string;
  password?: string;
  fullName: string;
}

export interface Article extends SchemaTimestampsConfig {
  _id: string;
  author: User | string;
  content: string;
  category: Category | string;
  subcategory: Subcategory | string;
  title: string;
}

export interface Sheilta extends SchemaTimestampsConfig {
  _id: string;
  author?: string;
  title: string;
  question: string;
  answer: string;
  category: Category | string;
  subcategory: Subcategory | string;
}

export interface Locale {
  _id: string;
  key: string;
  translation: Record<Languages, string>;
}

export interface Category {
  _id: string;
  name: Locale | string;
  subcategories: Array<Subcategory | string>;
}

export interface Subcategory {
  _id: string;
  name: Locale | string;
}

// Client models
export interface ClientSubcategory {
  _id: string;
  name: Record<'_id' | 'key', string>;
}

export interface ClientCategory {
  _id: string;
  name: Record<'_id' | 'key', string>;
  subcategories: Array<ClientSubcategory>;
}

export interface ClientArticle extends SchemaTimestampsConfig {
  _id: string;
  author: Pick<User, 'fullName' | '_id'>;
  content: string;
  category: ClientCategory;
  subcategory: ClientSubcategory;
  title: string;
}

export interface ClientSheilta extends SchemaTimestampsConfig {
  _id: string;
  author?: Pick<User, 'fullName' | '_id'>;
  title: string;
  question: string;
  answer: string;
  category: ClientCategory;
  subcategory: ClientSubcategory;
}

interface SchemaTimestampsConfig {
  createdAt: boolean | string;
  updatedAt: boolean | string;
  currentTime?: () => Date | number;
}

export interface ChildrenProps {
  children: ReactNode;
}

export interface LoginObj {
  username: string;
  password: string;
}

export interface AuthData {
  fullName: string;
  username: string;
  _id: string;
}

export interface SelectOption {
  name: string;
  value: string;
}

export interface Api<T, GetOverride = T> {
  name: Routes;
  get: (params: unknown) => Promise<GetOverride[]>;
  post: (body: Omit<T, '_id'>) => Promise<T | string>;
  put: (body: T) => Promise<T | string>;
}

// Type guards
// eslint-disable-next-line
export function isType<T>(obj: T | any, keys: string | string[]): obj is T {
  if (!obj) {
    return false;
  }

  if (Array.isArray(obj)) {
    return Array.isArray(keys)
      ? obj.every((arrayItem: T | any) => keys.every((key) => arrayItem[key])) // eslint-disable-line
      : obj.every((arrayItem: T | any) => arrayItem[keys]); // eslint-disable-line
  }

  return Array.isArray(keys) ? keys.every((key) => obj[key]) : obj[keys];
}

// enums
export type Languages = typeof languagesArray[number];

export type Methods = 'post' | 'get' | 'delete' | 'put';

export enum Routes {
  SHEILTAS = 'sheiltas',
  ARTICLES = 'articles',
  LOGIN = 'login',
  KEEP_ALIVE = 'keep-alive',
  SIGNUP = 'signup',
  USERS = 'users',
  LOCALES = 'locales',
  CATEGORIES = 'categories',
  SUBCATEGORIES = 'subcategories'
}

export enum ClientRoutes {
  ROOT = '/',
  EDITOR_ARTICLE = '/editor/article',
  EDITOR_SHEILTA = '/editor/sheilta',
  EDITOR_CATEGORIES = '/editor/categories',
  ARTICLES = '/articles',
  SHEILTAS = '/sheiltas'
}
