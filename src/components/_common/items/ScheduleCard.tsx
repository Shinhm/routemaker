import React, { useEffect } from 'react';
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  createStyles,
  IconButton,
  Theme,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { IRouteRoutesRegion } from '../../../models/Route';
import LinkIcon from '@material-ui/icons/Link';
import EditIcon from '@material-ui/icons/Edit';
import { Link } from 'react-router-dom';
import EncryptService from '../../../services/EncryptService';
import moment from 'moment';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 320,
      margin: '30px auto',
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
  })
);

interface ScheduleCardProps {
  date: string;
  region: IRouteRoutesRegion[];
  id: string;
}

function ScheduleCard({ date, region, id }: ScheduleCardProps) {
  const kakao = (window as any).kakao;
  const classes = useStyles();

  const addMarker = (position: string, idx: number, map: any) => {
    const marker = new kakao.maps.Marker({
      position: position,
    });

    marker.setMap(map);
  };

  const displayPlaces = (places: any[], map: any) => {
    const bounds = new kakao.maps.LatLngBounds();
    places.map((place, index) => {
      const placePosition = new kakao.maps.LatLng(place.y, place.x);
      addMarker(placePosition, index, map);
      bounds.extend(placePosition);
    });
    map.setBounds(bounds);
  };

  useEffect(() => {
    const container = document.getElementById(`map${date}`);
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      level: 4,
    };

    const map = new kakao.maps.Map(container, options);

    map.setDraggable(false);
    map.setZoomable(false);

    displayPlaces(region, map);
  }, []);

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            U
          </Avatar>
        }
        title={`${moment(date).format('yyyy년 MM월 DD일')}`}
        subheader={`식도락여행`}
      />
      <div id={`map${date}`} className={classes.media} />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          갈곳은 {region.map((result) => result.place_name).join(', ')} 입니다.
          <br />
          후후후 가즈아아아아
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
  );
}

export default ScheduleCard;
