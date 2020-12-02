import React, { useCallback, useEffect, useState } from 'react';
import FirebaseService from '../../services/FirebaseService';
import { useLocation, useParams } from 'react-router-dom';
import { IRoute, IRouteRoutes } from '../../models/Route';
import Layout from '../../components/_common/layout/Layout';
import ScheduleCard from '../../components/_common/items/ScheduleCard';
import SwiperClass from 'swiper/types/swiper-class';
import Empty from '../../components/_common/layout/Empty';
import { LinearProgress } from '@material-ui/core';
import qs from 'querystring';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import BottomNavigation from '../../components/_common/groups/BottomNavigation';
import { format } from 'date-fns';

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

function useQuery() {
  return qs.parse(useLocation().search.replace('?', ''));
}

function Index() {
  const { id }: { id: string } = useParams();
  const query = useQuery();
  const [routes, setRoutes] = useState<IRouteRoutes[]>([]);
  const [pending, setPending] = useState(true);
  const [controlledSwiper, setControlledSwiper] = useState<SwiperClass>();

  const fetchRoute = useCallback(async () => {
    try {
      const result = await FirebaseService.getCollection('routeMaker')
        .doc(id)
        .get();
      const { routes = [] } = result.data() as IRoute;
      setRoutes(routes);
    } catch (e) {
      console.log(e);
    } finally {
      setPending(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) {
      window.location.replace('/enter');
    }
    (async () => {
      await fetchRoute();
    })();
  }, [fetchRoute, id]);

  useEffect(() => {
    let activeIndex = routes?.findIndex(
      (tag) => tag.date === format(new Date(), 'yyyy-MM-dd')
    );
    if (query.scroll) {
      activeIndex = routes?.findIndex(
        (tag) => tag.date === query.scroll.toString()
      );
    }
    if (activeIndex) {
      controlledSwiper?.slideTo(activeIndex);
    }
  }, [routes, controlledSwiper, query.scroll]);

  return (
    <>
      <Layout
        appBar={{
          title: 'Schedule',
          id: id,
        }}
      >
        {pending ? (
          <LinearProgress />
        ) : (
          <>
            {routes.length === 0 && <Empty />}
            <Swiper
              onSwiper={setControlledSwiper}
              spaceBetween={10}
              style={{ marginTop: 10, padding: '0 15px', marginBottom: 50 }}
            >
              {routes?.map((route) => {
                return (
                  <SwiperSlide key={route.date} style={{ zIndex: 10 }}>
                    <ScheduleCard
                      route={route}
                      id={id}
                      fetchRoute={fetchRoute}
                    />
                  </SwiperSlide>
                );
              })}
            </Swiper>
            <BottomNavigation enabledAddButton={true} id={id} />
          </>
        )}
      </Layout>
    </>
  );
}

export default Index;
