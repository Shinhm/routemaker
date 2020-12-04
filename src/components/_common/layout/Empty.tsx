import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Theme, Typography } from '@material-ui/core';
import InboxIcon from '@material-ui/icons/Inbox';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 300,
      margin: '150px auto',
    },
  })
);

interface IEmptyProps {
  message: string;
}

function Empty({ message }: IEmptyProps) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <InboxIcon fontSize={'large'} />
      <Typography component={'h6'} style={{ whiteSpace: 'pre-wrap' }}>
        {message}
      </Typography>
    </div>
  );
}

export default Empty;
