import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  createStyles,
  Grid,
  IconButton,
  Theme,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  IRoute,
  IRouteRoutes,
  IRouteRoutesRegion,
} from '../../../models/Route';
import LinkIcon from '@material-ui/icons/Link';
import EditIcon from '@material-ui/icons/Edit';
import { Link, useParams } from 'react-router-dom';
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
import Enum from '../../../constants/Enum';
import { format } from 'date-fns';
import AmountDialog from '../dialogs/AmountDialog';
import FirebaseService from '../../../services/FirebaseService';
import { renderToString } from 'react-dom/server';
import StarMarker from '../map/StarMarker';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 320,
      margin: '30px auto',
      textAlign: 'left',
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
      backgroundColor: '#1D04BF',
    },
    timeLineItem: {
      '&::before': {
        content: 'none',
      },
    },
    timeLineConnector: {
      backgroundColor: '#1D04BF',
      opacity: 0.2,
    },
    amount: {
      color: 'red',
      opacity: 1,
      fontSize: 12,
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
  const classes = useStyles();
  const { id: inviteCode }: { id: string } = useParams();
  const { date, regions, budget } = route;
  const [open, setOpen] = useState(false);
  const [region, setRegion] = useState(regions[0]);

  const addMarker = (position: string, idx: number, map: any) => {
    const content = renderToString(<StarMarker />);
    const marker = new kakao.maps.CustomOverlay({
      position: position,
      content: content,
    });

    marker.setMap(map);
  };

  const polyLinePlaces = async (map: any) => {
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
  };

  const displayPlaces = (places: any[], map: any) => {
    const bounds = new kakao.maps.LatLngBounds();
    places.map((place, index) => {
      const placePosition = new kakao.maps.LatLng(place.y, place.x);
      addMarker(placePosition, index, map);
      bounds.extend(placePosition);
    });
    polyLinePlaces(map);
    map.setBounds(bounds);
  };

  const handleCompare = (a: string, b: string) => {
    const changeA = parseInt(a.replaceAll('-', ''));
    const changeB = parseInt(b.replaceAll('-', ''));
    return changeA >= changeB;
  };

  const handleOpenDialog = (region: IRouteRoutesRegion) => {
    setRegion(region);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleConfirm = async (region: IRouteRoutesRegion, amount: string) => {
    const result = await FirebaseService.getDoc(inviteCode);
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

  useEffect(() => {
    const container = document.getElementById(`map${date}`);
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      level: 4,
    };

    const map = new kakao.maps.Map(container, options);

    displayPlaces(regions, map);
  }, []);

  return (
    <>
      <Card className={classes.root}>
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
        <div id={`map${date}`} className={classes.media} />
        <CardContent className={classes.cardContent}>
          <Typography variant="body2" color="textSecondary" component="p">
            <Timeline>
              {regions.map((region, index) => {
                return (
                  <React.Fragment key={`region${index}`}>
                    <TimelineItem className={classes.timeLineItem}>
                      <TimelineSeparator>
                        <TimelineDot variant="outlined" color={'primary'} />
                        {regions.length !== index + 1 && (
                          <TimelineConnector
                            className={classes.timeLineConnector}
                          />
                        )}
                      </TimelineSeparator>
                      <TimelineContent>
                        <Grid container>
                          <Grid item xs={11}>
                            {region.place_name}
                            <br />
                            {region?.amount && (
                              <span
                                className={classes.amount}
                              >{`사용금액: ${parseInt(
                                region.amount
                              ).toLocaleString()}원`}</span>
                            )}
                          </Grid>
                          <Grid item xs={1}>
                            {handleCompare(
                              format(new Date(), 'yyyy-MM-dd'),
                              date
                            ) &&
                              Enum.possibleCategory(
                                region.category_group_code
                              ) && (
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
        </CardContent>
        <CardActions disableSpacing>
          <IconButton aria-label="link">
            <LinkIcon />
          </IconButton>
          <Link to={`/${id}/edit?q=${EncryptService.encrypt(date)}`}>
            <IconButton aria-label="link">
              <EditIcon />
            </IconButton>
          </Link>
        </CardActions>
      </Card>
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
