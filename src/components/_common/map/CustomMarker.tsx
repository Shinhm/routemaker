import Card from '@material-ui/core/Card';
import React from 'react';
import { IRouteRoutesRegion } from '../../../models/Route';
import { CardActions, CardContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

const useStyles = makeStyles({
  root: {
    minWidth: 150,
    paddingBottom: 5,
  },
  title: {
    fontSize: 10,
  },
  pos: {
    marginBottom: 12,
  },
  custom_marker: {
    width: '100%',
    backgroundColor: '#1D04BF',
    border: 'none',
    color: '#fff',
    outline: 'none',
  },
});

interface CustomMarkerProps {
  region: IRouteRoutesRegion;
}

function CustomMarker({ region }: CustomMarkerProps) {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardContent>
        <div>
          <h3>
            <a href={region.place_url} target={'_blank'} rel="noreferrer">
              {region.place_name}
            </a>
          </h3>
        </div>
        <div className={classes.pos}>
          <h6>{region.category_name}</h6>
        </div>
        <p style={{ margin: 0, fontSize: 10 }}>
          {region.address_name}
          <br />
          Tel.{region.phone}
        </p>
      </CardContent>
      <CardActions>
        <button
          type={'button'}
          data-region={JSON.stringify(region)}
          className={clsx(classes.custom_marker, 'custom_marker_click')}
        >
          담기
        </button>
      </CardActions>
    </Card>
  );
}

export default CustomMarker;
