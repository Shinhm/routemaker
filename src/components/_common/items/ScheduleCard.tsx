import React, { useCallback, useEffect, useState } from 'react';
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  createStyles,
  Grid,
  IconButton,
  Paper,
  Theme,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { IRouteRoutes, IRouteRoutesPlace } from '../../../models/Route';
import EditIcon from '@material-ui/icons/Edit';
import { useHistory, useParams } from 'react-router-dom';
import EncryptService from '../../../services/EncryptService';
import moment from 'moment';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from '@material-ui/lab';
import PostAddIcon from '@material-ui/icons/PostAdd';
import ReceiptIcon from '@material-ui/icons/Receipt';
import Enum, { REGION_CATEGORY } from '../../../constants/Enum';
import { format } from 'date-fns';
import AmountDialog from '../dialogs/AmountDialog';
import FirebaseService from '../../../services/FirebaseService';
import { renderToString } from 'react-dom/server';
import StarMarker from '../map/StarMarker';
import ShareIcon from '@material-ui/icons/Share';
import UserAgentService from '../../../services/UserAgentService';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textAlign: 'left',
      margin: '5px 0',
    },
    cardContent: {
      padding: '14px 0 0',
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
    avatar: {
      backgroundColor: theme.palette.primary.main,
    },
    timeLine: {
      margin: 0,
    },
    timeLineItem: {
      '&::before': {
        content: 'none',
      },
    },
    timeLineConnector: {
      backgroundColor: theme.palette.primary.main,
      opacity: 0.2,
    },
    amount: {
      color: 'red',
      opacity: 1,
      fontSize: 12,
    },
    groupName: {
      color: theme.palette.primary.main,
      opacity: 1,
      fontSize: 12,
    },
    notice: {
      textAlign: 'center',
      fontSize: 11,
    },
    tMap: {
      padding: '0 6px',
      fontSize: 10,
      color: 'red',
      border: '1px solid',
    },
  })
);

interface ScheduleCardProps {
  id: string;
  route: IRouteRoutes;
  fetchRoute: () => void;
}

function ScheduleCard({ id, route, fetchRoute }: ScheduleCardProps) {
  const kakao = (window as any).kakao;
  const kakaoSDK = (window as any).Kakao;
  const classes = useStyles();
  const history = useHistory();
  const { id: inviteCode }: { id: string } = useParams();
  const { date, regions, budget } = route;
  const [open, setOpen] = useState(false);
  const [region, setRegion] = useState(regions[0]);

  const addMarker = useCallback(
    (position: string, idx: number, map: any) => {
      const content = renderToString(
        <StarMarker idx={idx} end={regions.length} />
      );
      const marker = new kakao.maps.CustomOverlay({
        position: position,
        content: content,
      });

      marker.setMap(map);
    },
    [kakao.maps.CustomOverlay, regions.length]
  );

  const polyLinePlaces = useCallback(
    async (map: any) => {
      const linePath = await regions.map((region) => {
        return new kakao.maps.LatLng(region.y, region.x);
      });

      const polyline = new kakao.maps.Polyline({
        path: linePath,
        strokeWeight: 2,
        strokeColor: '#1D04BF',
        strokeOpacity: 0.7,
        strokeStyle: 'solid',
      });

      polyline.setMap(map);
    },
    [kakao.maps.LatLng, kakao.maps.Polyline, regions]
  );

  const displayPlaces = useCallback(
    (places: any[], map: any) => {
      const bounds = new kakao.maps.LatLngBounds();
      places.forEach((place, index) => {
        const placePosition = new kakao.maps.LatLng(place.y, place.x);
        addMarker(placePosition, index, map);
        bounds.extend(placePosition);
      });
      map.setBounds(bounds);
      (async (map) => {
        await polyLinePlaces(map);
      })(map);
    },
    [addMarker, kakao.maps.LatLng, kakao.maps.LatLngBounds, polyLinePlaces]
  );

  const dashToBlank = (text: string) => {
    return text.replace(new RegExp('-', 'g'), '');
  };

  const handleCompare = (date: string) => {
    const now = parseInt(dashToBlank(format(new Date(), 'yyyy-MM-dd')));
    const dateTime = parseInt(dashToBlank(date));
    return now >= dateTime;
  };

  const handleOpenDialog = (region: IRouteRoutesPlace) => {
    setRegion(region);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleConfirm = async (region: IRouteRoutesPlace, amount: string) => {
    const result = await FirebaseService.getDoc('routeMaker', inviteCode);
    const { routes = [], notice = '' } = result.data() || {};
    try {
      const createRegion = regions.map((fRegion) => {
        if (fRegion.id === region.id) {
          return { ...region, amount };
        }
        return fRegion;
      });
      const updateRegion = routes.map((route: IRouteRoutes) => {
        if (route.date === date) {
          return {
            ...route,
            regions: createRegion,
          };
        }
        return route;
      });
      await FirebaseService.setCollection(
        'routeMaker',
        {
          notice: notice,
          routes: updateRegion,
        },
        inviteCode
      );
      fetchRoute();
    } catch (e) {
      console.log(e);
    } finally {
      handleCloseDialog();
    }
  };

  const loadStaticMap = useCallback(
    (map: any) => {
      const staticMapContainer = document.getElementById(`staticMap${date}`);
      const bounds = new kakao.maps.LatLngBounds();
      const markers = regions.map((region) => {
        const latLng = new kakao.maps.LatLng(region.y, region.x);
        bounds.extend(latLng);
        return {
          position: latLng,
        };
      });
      const options = {
        center: map.getCenter(),
        level: map.getLevel(),
        marker: markers,
      };
      new kakao.maps.StaticMap(staticMapContainer, options);
    },
    [
      kakao.maps.LatLngBounds,
      kakao.maps.LatLng,
      kakao.maps.StaticMap,
      date,
      regions,
    ]
  );

  const handleKakaoShare = () => {
    const elementById = document.querySelector(
      `#staticMap${date} img`
    ) as HTMLImageElement;
    if (elementById) {
      const message = `${regions[0].place_name}에서 시작해서\n${
        regions[regions.length - 1].place_name
      }까지 일정입니다.`;
      kakaoSDK.Link.sendCustom({
        templateId: 40757,
        templateArgs: {
          id: inviteCode,
          title: `${date} 일정`,
          message: message,
          image: elementById.src,
          anchor: date,
        },
      });
    }
  };

  useEffect(() => {
    const container = document.getElementById(`map${date}`);
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      level: 4,
    };

    const map = new kakao.maps.Map(container, options);

    displayPlaces(regions, map);
    loadStaticMap(map);
  }, [
    date,
    displayPlaces,
    kakao.maps.LatLng,
    kakao.maps.Map,
    regions,
    loadStaticMap,
  ]);

  return (
    <>
      <Paper elevation={3}>
        <Card className={classes.root} id={date}>
          <CardHeader
            avatar={
              <Avatar aria-label="recipe" className={classes.avatar}>
                U
              </Avatar>
            }
            title={`${moment(date).format('yyyy년 MM월 DD일')}`}
            subheader={
              budget ? `예산: ${parseInt(budget).toLocaleString()}원` : ''
            }
          />
          <div
            id={`staticMap${date}`}
            style={{
              width: 400,
              height: 400,
              position: 'absolute',
              top: -500,
              left: 0,
            }}
          />
          <div id={`map${date}`} className={classes.media} />
          <CardContent className={classes.cardContent}>
            <Typography variant="body2" color="textSecondary" component="p">
              <Timeline className={classes.timeLine}>
                {regions.map((region, index) => {
                  return (
                    <React.Fragment key={`region${index}`}>
                      <TimelineItem className={classes.timeLineItem}>
                        <TimelineSeparator>
                          <TimelineDot
                            variant="outlined"
                            style={{
                              borderColor:
                                (index === 0 && 'green') ||
                                (index === regions.length - 1 && 'red') ||
                                '#1D04BF',
                            }}
                          />
                          {regions.length !== index + 1 && (
                            <TimelineConnector
                              className={classes.timeLineConnector}
                            />
                          )}
                        </TimelineSeparator>
                        <TimelineContent>
                          <Grid container>
                            <Grid item xs={11}>
                              <a
                                href={region.place_url}
                                target={'_blank'}
                                rel="noreferrer"
                              >
                                {region.place_name}{' '}
                              </a>
                              {region.category_group_name && (
                                <span className={classes.groupName}>
                                  [{region.category_group_name}]
                                </span>
                              )}
                              <br />
                              {region?.time && (
                                <span className={classes.groupName}>
                                  {region.time}에 방문예정
                                </span>
                              )}
                              {region?.time && region?.amount && (
                                <span className={classes.groupName}>
                                  {' | '}
                                </span>
                              )}
                              {region?.amount && (
                                <span
                                  className={classes.amount}
                                >{`사용금액: ${parseInt(
                                  region.amount
                                ).toLocaleString()}원`}</span>
                              )}
                              <br />
                              {UserAgentService.isMobile() && (
                                <a
                                  href={`tmap://search?name=${region.place_name}`}
                                  target={'_blank'}
                                  rel="noreferrer"
                                  className={classes.tMap}
                                >
                                  T map
                                </a>
                              )}
                            </Grid>
                            <Grid item xs={1}>
                              {Enum.possibleCategory(
                                region.category_group_code
                              ) &&
                                (region.category_group_code ===
                                  REGION_CATEGORY.AD5 ||
                                  handleCompare(date)) && (
                                  <PostAddIcon
                                    fontSize={'small'}
                                    onClick={() => handleOpenDialog(region)}
                                  />
                                )}
                            </Grid>
                          </Grid>
                        </TimelineContent>
                      </TimelineItem>
                    </React.Fragment>
                  );
                })}
              </Timeline>
            </Typography>
            {!handleCompare(date) && (
              <>
                <p className={classes.notice}>
                  * [숙박] 카테고리를 제외한 모든 카테고리들은
                  <br />
                  계획한 날짜가 되면 금액작성 버튼이 생성됩니다.
                </p>
                <p className={classes.notice}>
                  * 영수증은 루트에 설정된 날짜가 되면 볼 수 있습니다.
                </p>
              </>
            )}
          </CardContent>
          <CardActions disableSpacing>
            <IconButton
              aria-label="link"
              className={'copy_url_btn'}
              data-clipboard-text={`${window.location.origin}${window.location.pathname}?scroll=${date}`}
              onClick={() => {
                handleKakaoShare();
              }}
            >
              <ShareIcon />
            </IconButton>
            <IconButton
              aria-label="link"
              onClick={() => {
                history.replace(`${window.location.pathname}?scroll=${date}`);
                history.push(`/${id}/edit?q=${EncryptService.encrypt(date)}`);
              }}
            >
              <EditIcon />
            </IconButton>
            {handleCompare(date) && (
              <IconButton
                onClick={() => {
                  history.replace(`${window.location.pathname}?scroll=${date}`);
                  history.push(
                    `/${id}/receipt?q=${EncryptService.encrypt(date)}`
                  );
                }}
              >
                <ReceiptIcon />
              </IconButton>
            )}
          </CardActions>
        </Card>
      </Paper>
      {open && (
        <AmountDialog
          handleClose={handleCloseDialog}
          handleConfirm={handleConfirm}
          region={region}
        />
      )}
    </>
  );
}

export default ScheduleCard;
