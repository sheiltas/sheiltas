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
import { ChildrenProps, locales, loginObj } from '../types';
import localesData from '../resources/localesData.json';
import { authApi } from '../api';
import { decodeJwt } from '../utils';

interface context {
  locale: { [key: string]: string };
  setSelectedLanguage: Dispatch<SetStateAction<locales>>;
  selectedLanguage: locales;
  login: (body: loginObj) => Promise<boolean>;
  user: { fullName: string; username: string };
}

const Context = createContext<context>({
  locale: {},
  setSelectedLanguage: () => undefined,
  selectedLanguage: 'he',
  login: (body) => Promise.resolve(false),
  user: { fullName: '', username: '' }
});

const ClientProvider = (props: ChildrenProps) => {
  const { children } = props;
  const [user, setUser] = useState({ fullName: '', username: '' });

  const [selectedLanguage, setSelectedLanguage] = useState<locales>('he');

  const locale = useMemo(() => localesData[selectedLanguage], [
    selectedLanguage
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
