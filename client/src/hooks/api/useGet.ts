import { QueryObserverResult, useQuery } from 'react-query';
import { Api } from '../../types';

const useGet = <T>(api: Api<T>): QueryObserverResult<T[]> =>
  useQuery(api.name, api.get);

export default useGet;
