import React, { useCallback, useEffect, useState } from 'react';
import FirebaseService, {
  FireStoreSchema,
} from '../../services/FirebaseService';
import { useHistory, useParams } from 'react-router-dom';
import { IRoute } from '../../models/Route';
import Layout from '../../components/_common/layout/Layout';
import ScheduleCard from '../../components/_common/items/ScheduleCard';
import SwiperClass from 'swiper/types/swiper-class';
import Empty from '../../components/_common/layout/Empty';
import { LinearProgress } from '@material-ui/core';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { A11y, Navigation, Pagination, Scrollbar } from 'swiper';
import BottomNavigation from '../../components/_common/groups/BottomNavigation';
import { format } from 'date-fns';
import useQuery from '../../hooks/useQuery';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { setRoutes } from '../../store/RouteStore';
import { makeInviteCode } from '../index';
import ConfirmDialog from '../../components/_common/dialogs/ConfirmDialog';
import { IUserRoutes } from '../../models/User';

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

function Index() {
  const { id }: { id: string } = useParams();
  const { query } = useQuery();
  const history = useHistory();
  const dispatch = useDispatch();
  const [pending, setPending] = useState(true);
  const [actionButtonPending, setActionButtonPending] = useState(false);
  const [enableActionButton, setEnableActionButton] = useState(true);
  const [message, setMessage] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [controlledSwiper, setControlledSwiper] = useState<SwiperClass>();

  const { routes: rootRoutes } = useSelector(
    (state: IRootState) => state.route
  );
  const { kakaoAuth } = useSelector((state: IRootState) => state.user);

  const { routes, owners = [] } = rootRoutes || {};

  const openConfirmDialog = (message: string) => {
    setMessage(message);
    setOpenDialog(true);
  };

  const closeConfirmDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirm = () => {
    history.push(`/enter?continue=/${id}/trip`);
  };

  const fetchRoute = useCallback(async () => {
    if (routes) {
      return setPending(false);
    }
    try {
      const result = await FirebaseService.getDoc(FireStoreSchema.route, id);
      const routes = result.data() as IRoute;
      dispatch(setRoutes(routes));
    } catch (e) {
      console.log(e);
    } finally {
      setPending(false);
    }
  }, [dispatch, routes, id]);

  const copyRouteForMe = useCallback(async () => {
    if (!kakaoAuth) {
      openConfirmDialog('로그인 하셔야 이용가능합니다.\n로그인하시겠습니까?');
      return;
    }
    if (!routes) {
      return;
    }
    const elementById = document.querySelector(
      `#staticMap${routes[0].date} img`
    ) as HTMLImageElement;
    const dateRange = `${routes[0].date} ~ ${routes[routes.length - 1].date}`;
    setActionButtonPending(true);
    try {
      const code = (await makeInviteCode()) as string;
      const result = await FirebaseService.getDoc(
        FireStoreSchema.users,
        kakaoAuth.id.toString()
      );
      const userRoutes = (result.data() as IUserRoutes[]) || [];

      await FirebaseService.setCollection(
        FireStoreSchema.route,
        {
          routes: routes,
          role: 'self',
        },
        code
      );
      await FirebaseService.setCollection(
        FireStoreSchema.route,
        {
          routes: routes,
          owners: owners.concat(kakaoAuth?.id.toString()),
        },
        id
      );
      await FirebaseService.setCollection(
        FireStoreSchema.users,
        {
          userRoutes: userRoutes.concat({
            id,
            imageUrl: elementById.src,
            dateRange: dateRange,
          }),
        },
        kakaoAuth.id.toString()
      );
      dispatch(
        setRoutes({
          routes: routes,
          owners: owners.concat(kakaoAuth?.id.toString()),
        } as IRoute)
      );
    } catch (e) {
      console.log(e);
    } finally {
      setActionButtonPending(false);
    }
  }, [dispatch, id, kakaoAuth, owners, routes]);

  useEffect(() => {
    if (!id) {
      history.replace('/enter');
    }
    (async () => {
      await fetchRoute();
    })();
  }, [fetchRoute, history, id]);

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

  useEffect(() => {
    if (!routes || routes?.length === 0) {
      setEnableActionButton(false);
    } else if (kakaoAuth) {
      setEnableActionButton(!owners.includes(kakaoAuth.id.toString()));
    }
  }, [routes, owners, kakaoAuth]);

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
            {(!routes || routes?.length === 0) && (
              <Empty
                message={'루트가 비었습니다.\n아래 + 버튼으로 추가해주세요.'}
              />
            )}
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
            <BottomNavigation
              enabledAddButton={true}
              enabledActionButton={routes?.length !== 0 && enableActionButton}
              onClick={copyRouteForMe}
              id={id}
              pending={actionButtonPending}
              label={'일정 소유'}
            />
            {openDialog && (
              <ConfirmDialog
                message={message}
                handleClose={closeConfirmDialog}
                handleConfirm={handleConfirm}
              />
            )}
          </>
        )}
      </Layout>
    </>
  );
}

export default Index;
