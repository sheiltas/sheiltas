import React, {
  createContext,
  Dispatch,
  memo,
  SetStateAction,
  useContext,
  useMemo,
  useState
} from 'react';
import { ChildrenProps, locales } from '../types';
import localesData from '../resources/localesData.json';

interface context {
  locale: { [key: string]: string };
  setSelectedLanguage: Dispatch<SetStateAction<locales>>;
  selectedLanguage: locales;
}

const Context = createContext<context>({
  locale: {},
  setSelectedLanguage: () => undefined,
  selectedLanguage: 'he'
});

const ClientProvider = (props: ChildrenProps) => {
  const { children } = props;

  const [selectedLanguage, setSelectedLanguage] = useState<locales>('he');

  const locale = useMemo(() => localesData[selectedLanguage], [
    selectedLanguage
  ]);

  return (
    <Context.Provider
      value={{
        locale,
        setSelectedLanguage,
        selectedLanguage
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default memo(ClientProvider);

export const useClientProvider = () => useContext(Context);
