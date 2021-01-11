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

import { ChildrenProps, languages, loginObj } from '../types';
import { authApi, localesApi } from '../api';
import { decodeJwt, languages as languagesArray } from '../utils';

interface context {
  locale: { [key: string]: string };
  setSelectedLanguage: Dispatch<SetStateAction<languages>>;
  selectedLanguage: languages;
  login: (body: loginObj) => Promise<boolean>;
  user: { fullName: string; username: string };
}

const Context = createContext<context>({
  locale: {},
  setSelectedLanguage: () => undefined,
  selectedLanguage: 'he',
  login: () => Promise.resolve(false),
  user: { fullName: '', username: '' }
});

const ClientProvider = (props: ChildrenProps) => {
  const { children } = props;
  const [user, setUser] = useState({ fullName: '', username: '' });

  // Locales handlers
  const [selectedLanguage, setSelectedLanguage] = useState<languages>('he');
  const [localesData, setLocalsData] = useState<
    Record<languages, Record<string, string>>
  >(
    languagesArray.reduce((acc, language) => {
      acc[language] = {};
      return acc;
    }, {} as Record<languages, Record<string, string>>)
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
          }, {} as any)
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
      const { username, fullName } = decodeJwt(token);
      setUser({ username, fullName });
    }
  }, []);

  const login = useCallback(async (body: loginObj) => {
    const token = await authApi.login(body);
    if (typeof token === 'string') {
      const { username, fullName } = decodeJwt(token);
      if (username && fullName) {
        setUser({ username, fullName });
        return true;
      } else {
        return false;
      }
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
        user
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default memo(ClientProvider);

export const useClientContext = () => useContext(Context);
