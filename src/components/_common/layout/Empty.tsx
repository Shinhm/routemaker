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
    emptyColor: {
      color: 'rgba(0,0,0,0.6)',
    },
  })
);

function Empty() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <InboxIcon fontSize={'large'} className={classes.emptyColor} />
      <Typography component={'h6'} className={classes.emptyColor}>
        루트가 비었습니다.
        <br />
        아래 + 버튼으로 추가해주세요.
      </Typography>
    </div>
  );
}

export default Empty;
