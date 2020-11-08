import React, { useEffect, useState } from 'react';
import FirebaseService from '../../services/FirebaseService';
import { useParams } from 'react-router-dom';
import { IRoute, IRouteRoutes } from '../../models/Route';
import Layout from '../../components/_common/layout/Layout';
import ScheduleCard from '../../components/_common/items/ScheduleCard';

function Detail() {
  const { id }: { id: string } = useParams();
  const [routes, setRoutes] = useState<IRouteRoutes[]>([]);

  const fetchRoute = async () => {
    try {
      const result = await FirebaseService.getCollection().doc(id).get();
      const { routes } = result.data() as IRoute;
      setRoutes(routes || []);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (!id) {
      window.location.replace('/enter');
    }
    (async () => {
      await fetchRoute();
    })();
  }, []);

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
        {routes.map((route) => {
          return (
            <React.Fragment key={route.date}>
              <ScheduleCard date={route.date} region={route.regions} id={id} />
            </React.Fragment>
          );
        })}
      </Layout>
    </>
  );
}

export default Detail;
