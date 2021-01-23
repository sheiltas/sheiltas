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

import { ChildrenProps, Languages, LoginObj, User } from '../types';
import { authApi, localesApi } from '../api';
import { languages as languagesArray } from '../utils';

export const decodeJwt = (
  token: string
): Pick<User, 'username' | 'fullName'> | false => {
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
  user: { fullName: string; username: string };
  isAuthorized: boolean;
}

const Context = createContext<IClientProviderContext>({
  locale: {},
  setSelectedLanguage: () => undefined,
  selectedLanguage: 'he',
  login: () => Promise.resolve(false),
  user: { fullName: '', username: '' },
  isAuthorized: false
});

const ClientProvider = (props: ChildrenProps) => {
  const { children } = props;
  const [user, setUser] = useState({ fullName: '', username: '' });
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
      setLocalsData(
        data.reduce(
          (acc, localeObj) => {
            const { key, translation } = localeObj;
            Object.entries(translation).forEach(([translationLang, value]) => {
              acc[translationLang][key] = value;
            });
            return acc;
          },
          languagesArray.reduce((acc, lang) => {
            acc[lang] = {};
            return acc;
          }, {} as Record<string, Record<string, string>>)
        )
      );
    }
  });

  const locale = useMemo(() => localesData[selectedLanguage], [
    selectedLanguage,
    localesData
  ]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const { username, fullName } = decodeJwt(token) || {};
      if (username && fullName) {
        setUser({ username, fullName });
      }
    }
  }, []);

  const login = useCallback(async (body: LoginObj) => {
    const token = await authApi.login(body);
    if (typeof token === 'string') {
      const { username, fullName } = decodeJwt(token) || {};
      if (username && fullName) {
        setUser({ username, fullName });
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
        isAuthorized
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default memo(ClientProvider);

export const useClientContext = (): IClientProviderContext =>
  useContext(Context);
