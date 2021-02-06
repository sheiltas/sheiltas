import { QueryObserverResult, useQuery, UseQueryOptions } from 'react-query';
import { Api } from '../../types';

const useGet = <T>(
  api: Api<T>,
  options?: UseQueryOptions<T[]>
): QueryObserverResult<T[]> => useQuery(api.name, api.get, options);

export default useGet;
