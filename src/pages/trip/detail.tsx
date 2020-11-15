import React, { useCallback, useEffect, useState } from 'react';
import FirebaseService from '../../services/FirebaseService';
import { useLocation, useParams } from 'react-router-dom';
import { IRoute, IRouteRoutes } from '../../models/Route';
import Layout from '../../components/_common/layout/Layout';
import ScheduleCard from '../../components/_common/items/ScheduleCard';
import Empty from '../../components/_common/layout/Empty';
import { LinearProgress } from '@material-ui/core';
import qs from 'querystring';

function useQuery() {
  return qs.parse(useLocation().search.replace('?', ''));
}

function Detail() {
  const { id }: { id: string } = useParams();
  const query = useQuery();
  const [routes, setRoutes] = useState<IRouteRoutes[]>([]);
  const [pending, setPending] = useState(true);

  const fetchRoute = useCallback(async () => {
    try {
      const result = await FirebaseService.getCollection().doc(id).get();
      const { routes = [] } = result.data() as IRoute;
      setRoutes(routes);
    } catch (e) {
      console.log(e);
    } finally {
      if (query.scroll) {
        setTimeout(() => {
          const element = document.getElementById(query.scroll.toString());
          if (element) {
            const headerOffset = 55;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
              top: offsetPosition,
            });
          }
        }, 500);
      }
      setPending(false);
    }
  }, [id, query.scroll]);

  useEffect(() => {
    if (!id) {
      window.location.replace('/enter');
    }
    (async () => {
      await fetchRoute();
    })();
  }, [fetchRoute, id]);

  return (
    <>
      <Layout
        appbar={{
          title: 'Schedule',
          id: id,
          enabledMenuButton: true,
          enabledAddButton: true,
        }}
      >
        {pending ? (
          <LinearProgress />
        ) : (
          <>
            {routes.length === 0 && <Empty />}
            {routes?.map((route) => {
              return (
                <React.Fragment key={route.date}>
                  <ScheduleCard route={route} id={id} fetchRoute={fetchRoute} />
                </React.Fragment>
              );
            })}
          </>
        )}
      </Layout>
    </>
  );
}

export default Detail;
