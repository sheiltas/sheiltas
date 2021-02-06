import React, {
  createContext,
  Dispatch,
  memo,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useQuery } from 'react-query';

import {
  ChildrenProps,
  ClientArticle,
  ClientSheilta,
  Languages,
  LoginObj,
  User
} from '../types';
import { authApi, localesApi } from '../api';
import { languages, languages as languagesArray } from '../utils';

export const decodeJwt = (
  token: string
): Pick<User, 'username' | 'fullName' | '_id'> | false => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return false;
  }
};

interface IClientProviderContext {
  locale: { [key: string]: string };
  setSelectedLanguage: Dispatch<SetStateAction<Languages>>;
  selectedLanguage: Languages;
  login: (body: LoginObj) => Promise<boolean>;
  user: { fullName: string; username: string; _id: string };
  isAuthorized: boolean;
  selectedEdit: ClientArticle | ClientSheilta | null;
  setSelectedEdit: Dispatch<
    SetStateAction<ClientArticle | ClientSheilta | null>
  >;
  setLocalsData: Dispatch<
    SetStateAction<Record<Languages, Record<string, string>>>
  >;
  localesData: Record<Languages, Record<string, string>>;
}

const Context = createContext<IClientProviderContext>({
  locale: {},
  setSelectedLanguage: () => undefined,
  selectedLanguage: 'he',
  login: () => Promise.resolve(false),
  user: { fullName: '', username: '', _id: '' },
  isAuthorized: false,
  selectedEdit: null,
  setSelectedEdit: () => undefined,
  setLocalsData: () => undefined,
  localesData: {
    he: {},
    en: {}
  }
});

const ClientProvider = (props: ChildrenProps) => {
  const { children } = props;
  const [user, setUser] = useState({ fullName: '', username: '', _id: '' });
  const [selectedEdit, setSelectedEdit] = useState<
    ClientArticle | ClientSheilta | null
  >(null);

  const isAuthorized = useMemo(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const { username, fullName } = decodeJwt(token) || {};
      return !!(username && fullName);
    }
    return false;
  }, []);

  // Locales handlers
  const [selectedLanguage, setSelectedLanguage] = useState<Languages>('he');
  const [localesData, setLocalsData] = useState<
    Record<Languages, Record<string, string>>
  >(
    languagesArray.reduce((acc, language) => {
      acc[language] = {};
      return acc;
    }, {} as Record<Languages, Record<string, string>>)
  );

  useQuery(localesApi.name, localesApi.get, {
    onSuccess: (data) => {
      if (data.length) {
        setLocalsData(
          data.reduce(
            (acc, localeObj) => {
              const { key, translation } = localeObj;
              Object.entries(translation).forEach(
                ([translationLang, value]) => {
                  acc[translationLang][key] = value;
                }
              );
              return acc;
            },
            languagesArray.reduce((acc, lang) => {
              acc[lang] = {};
              return acc;
            }, {} as Record<string, Record<string, string>>)
          )
        );
      }
    }
  });

  const locale = useMemo(() => {
    console.log('restting locales');
    return localesData[selectedLanguage];
  }, [selectedLanguage, localesData]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { username, fullName, _id } = decodeJwt(token) || {};
      if (username && fullName && _id) {
        setUser({ username, fullName, _id });
      }
    }
  }, []);

  const login = useCallback(async (body: LoginObj) => {
    const token = await authApi.login(body);
    if (typeof token === 'string') {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { username, fullName, _id } = decodeJwt(token) || {};
      if (username && fullName && _id) {
        setUser({ username, fullName, _id });
        return true;
      }
      return false;
    }
    return false;
  }, []);

  return (
    <Context.Provider
      value={{
        locale,
        setSelectedLanguage,
        selectedLanguage,
        login,
        user,
        isAuthorized,
        selectedEdit,
        setSelectedEdit,
        setLocalsData,
        localesData
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default memo(ClientProvider);

export const useClientContext = (): IClientProviderContext =>
  useContext(Context);
