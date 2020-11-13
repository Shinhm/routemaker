import Card from '@material-ui/core/Card';
import React from 'react';
import { IRouteRoutesPlace } from '../../../models/Route';
import { CardContent, createStyles, Grid, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import clsx from 'clsx';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      padding: 0,
      '& div': {
        padding: '0px !important',
      },
    },
    title: {
      fontSize: 10,
    },
    pos: {
      marginBottom: 12,
    },
    custom_marker: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.palette.primary.main,
      border: 'none',
      color: '#fff',
      outline: 'none',
    },
  })
);

interface CustomMarkerProps {
  region: IRouteRoutesPlace;
  handleSelect: (region: IRouteRoutesPlace) => void;
}

function CustomMarker({ region, handleSelect }: CustomMarkerProps) {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardContent>
        <Grid container>
          <Grid item xs={9}>
            <div>
              <h3>
                <a href={region.place_url} target={'_blank'} rel="noreferrer">
                  {region.place_name}
                </a>
              </h3>
              {region.category_group_name && (
                <span style={{ paddingLeft: 5, fontSize: 12 }}>
                  {region.category_name}
                </span>
              )}
            </div>
            <p style={{ margin: 0, fontSize: 13 }}>
              {region.address_name}
              <br />
              {region.phone && <span>Tel.{region.phone}</span>}
            </p>
          </Grid>
          <Grid item xs={3}>
            <button
              type={'button'}
              data-region={JSON.stringify(region)}
              onClick={() => handleSelect(region)}
              className={clsx(classes.custom_marker)}
            >
              <SaveAltIcon />
            </button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default CustomMarker;
