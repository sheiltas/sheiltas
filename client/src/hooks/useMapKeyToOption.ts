import { useClientContext } from '../providers/ClientProvider';
import { SelectOption } from '../types';

const useMapKeyToOption = (): ((option: {
  _id: string;
  name: {
    key: string;
  };
}) => SelectOption) => {
  const { locale } = useClientContext();

  return (option: { _id: string; name: { key: string } }) => ({
    value: option._id,
    name: locale[option.name.key]
  });
};

export default useMapKeyToOption;
