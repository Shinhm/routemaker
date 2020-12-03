import qs from 'querystring';
import { useLocation } from 'react-router-dom';

function useQuery() {
  return { query: qs.parse(useLocation().search.replace('?', '')) };
}

export default useQuery;
