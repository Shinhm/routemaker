import React from 'react';
import StarsIcon from '@material-ui/icons/Stars';
import { createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) =>
  createStyles({
    starMarker: {
      width: 15,
      height: 15,
      color: theme.palette.primary.main,
    },
  })
);

function StarMarker() {
  const classes = useStyles();
  return <StarsIcon className={classes.starMarker} />;
}

export default StarMarker;
