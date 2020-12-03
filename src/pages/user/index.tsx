import React, { useCallback, useEffect, useState } from 'react';
import Layout from '../../components/_common/layout/Layout';
import { IRootState } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import Empty from '../../components/_common/layout/Empty';
import FirebaseService, {
  FireStoreSchema,
} from '../../services/FirebaseService';
import { IUser } from '../../models/User';
import { setUserRoute } from '../../store/UserStore';
import UserScheduleCard from '../../components/_common/items/UserScheduleCard';
import {
  Avatar,
  Button,
  Grid,
  GridList,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tab,
  Tabs,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import GetAppIcon from '@material-ui/icons/GetApp';
import AppsOutlinedIcon from '@material-ui/icons/AppsOutlined';
import { useUserStyle } from './index.style';

function User() {
  const classes = useUserStyle();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { kakaoAuth, user } = useSelector((state: IRootState) => state.user);

  const { userRoutes, pickRoutes, likeRoutes } = user || {};

  const [pending, setPending] = useState(true);
  const [value, setValue] = useState(0);
  const [routes, setRoutes] = useState(userRoutes);

  const fetchRoute = useCallback(async () => {
    if (!kakaoAuth || user) {
      return setPending(false);
    }
    try {
      const result = await FirebaseService.getDoc(
        FireStoreSchema.users,
        kakaoAuth.id.toString()
      );
      const userInfo = result.data() as IUser;
      dispatch(setUserRoute(userInfo));
    } catch (e) {
      console.log(e);
    } finally {
      setPending(false);
    }
  }, [user, dispatch, kakaoAuth]);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    switch (newValue) {
      case 1:
        setRoutes(pickRoutes);
        break;
      case 2:
        setRoutes(likeRoutes);
        break;
      default:
        setRoutes(userRoutes);
        break;
    }
    setValue(newValue);
  };

  useEffect(() => {
    setRoutes(userRoutes);
  }, [userRoutes, user]);

  useEffect(() => {
    (async () => {
      await fetchRoute();
    })();
  }, [fetchRoute]);

  return (
    <Layout appBar={{ title: `ROUTE MAKER` }}>
      {pending ? (
        <LinearProgress />
      ) : (
        <>
          <Grid
            container
            xs={12}
            justify={'space-between'}
            alignItems={(isMobile && 'center') || 'flex-start'}
            className={classes.root}
          >
            <Grid sm={4} xs={2}>
              <Avatar
                className={classes.avatar}
                alt="Remy Sharp"
                src={kakaoAuth?.properties?.profile_image}
              />
            </Grid>
            <Grid sm={8} xs={10}>
              <div>
                <div className={classes.titleField}>
                  {kakaoAuth &&
                    `${kakaoAuth.properties.nickname}님 어서오세요.`}
                  <Button
                    className={classes.makeButton}
                    variant="outlined"
                    color="primary"
                  >
                    루트만들기
                  </Button>
                </div>
                {!isMobile && (
                  <Grid item xs={12} md={6}>
                    <List dense={true}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar variant="square" className={classes.allIcon}>
                            <AppsOutlinedIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={`ALL 루트  ${userRoutes?.length || 0}개`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar variant="square" className={classes.pickIcon}>
                            <GetAppIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={`PICK 루트 ${pickRoutes?.length || 0}개`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar
                            variant="square"
                            className={classes.favoriteIcon}
                          >
                            <FavoriteIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={`LIKE 루트 ${likeRoutes?.length || 0}개`}
                        />
                      </ListItem>
                    </List>
                  </Grid>
                )}
              </div>
            </Grid>
          </Grid>
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab
              label={`all 루트 ${
                isMobile ? `(${userRoutes?.length || 0})` : ''
              }`}
            />
            <Tab
              label={`pick 루트 ${
                isMobile ? `(${pickRoutes?.length || 0})` : ''
              }`}
            />
            <Tab
              label={`Like 루트 ${
                isMobile ? `(${likeRoutes?.length || 0})` : ''
              }`}
            />
          </Tabs>
          <GridList className={classes.gridRoot}>
            {(!routes || routes?.length === 0) && (
              <Empty message={'루트가 없는데요'} />
            )}
            {routes?.map((route, index) => {
              return (
                <React.Fragment key={index}>
                  <Grid xs={6} sm={4}>
                    <UserScheduleCard
                      id={route.id}
                      imageUrl={route.imageUrl}
                      dateRange={route.dateRange}
                    />
                  </Grid>
                </React.Fragment>
              );
            })}
          </GridList>
        </>
      )}
    </Layout>
  );
}

export default User;
