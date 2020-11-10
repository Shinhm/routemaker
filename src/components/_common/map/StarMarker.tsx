import React from 'react';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import { createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) =>
  createStyles({
    starMarker: {
      width: 15,
      height: 15,
    },
  })
);

interface IStarMarkerProps {
  idx: number;
  end: number;
}

function StarMarker({ idx, end }: IStarMarkerProps) {
  const classes = useStyles();
  return (
    <RadioButtonUncheckedIcon
      className={classes.starMarker}
      fontSize={'large'}
      style={{
        color:
          (idx === 0 && 'green') || (idx === end - 1 && 'red') || '#1D04BF',
      }}
    />
  );
}

export default StarMarker;
