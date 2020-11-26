import React from 'react';
import { createStyles, Grid, Paper, Theme } from '@material-ui/core';
import AddAlarmIcon from '@material-ui/icons/AddAlarm';
import { makeStyles } from '@material-ui/core/styles';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

export interface CardProps {
  id: string;
  text: string;
  time?: string;
  placeUrl?: string;
  handleOpenDialog: () => void;
  handleOpenRemoveDialog: (id: string) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: 20,
      padding: '15px 5px',
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    isDragging: {
      borderColor: 'rgba(0, 0, 0, 0.09)',
    },
  })
);

function RegionCard({
  id,
  text,
  time,
  placeUrl,
  handleOpenDialog,
  handleOpenRemoveDialog,
}: CardProps) {
  const classes = useStyles();

  return (
    <Paper className={classes.root} elevation={4}>
      <Grid container justify="space-around" alignItems="center">
        <Grid item xs={9}>
          <div>
            <a href={placeUrl} target={'_blank'} rel="noreferrer">
              {text}
            </a>{' '}
            {time && `(${time} 방문예정)`}
          </div>
        </Grid>
        <Grid item xs={3}>
          <AddAlarmIcon
            style={{ marginRight: 10 }}
            onClick={handleOpenDialog}
            fontSize={'small'}
          />
          <DeleteForeverIcon
            onClick={() => handleOpenRemoveDialog(id)}
            fontSize={'small'}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}

export default RegionCard;
