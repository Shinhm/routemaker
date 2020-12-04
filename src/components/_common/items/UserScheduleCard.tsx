import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { GridListTile, GridListTileBar, IconButton } from '@material-ui/core';
import { IUserRoutes } from '../../../models/User';
import InfoIcon from '@material-ui/icons/Info';
import { Link } from 'react-router-dom';

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
});

function UserScheduleCard({ imageUrl, dateRange, id }: IUserRoutes) {
  const classes = useStyles();
  return (
    <GridListTile key={imageUrl}>
      <>
        <Link to={`/${id}/trip`}>
          <img width={'100%'} src={imageUrl} alt={dateRange} />
        </Link>
        <GridListTileBar
          title={dateRange}
          actionIcon={
            <IconButton
              aria-label={`info about ${dateRange}`}
              className={classes.icon}
            >
              <InfoIcon />
            </IconButton>
          }
        />
      </>
    </GridListTile>
  );
}

export default UserScheduleCard;
