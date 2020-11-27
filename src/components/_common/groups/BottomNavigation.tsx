import React from 'react';
import {
  Button,
  CircularProgress,
  createStyles,
  Grid,
  IconButton,
  Theme,
} from '@material-ui/core';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuButton: {
      color: '#fff',
    },
    bottomMenuBar: {
      width: '100%',
      height: 45,
      left: 0,
      [theme.breakpoints.up('sm')]: {
        left: '50%',
        width: theme.breakpoints.width('lg'),
        marginLeft: -(theme.breakpoints.width('lg') / 2),
      },
      position: 'fixed',
      bottom: 0,
      zIndex: 99999,
      borderRadius: '40px 40px 0 0',
    },
    bottomMainActionButton: {
      width: '95%',
      background: '#fff',
      border: '1px solid',
      borderColor: theme.palette.primary.main,
      borderRadius: 50,
      marginTop: -11,
    },
    bottomSideActionButtonLeft: {
      zIndex: 100,
      height: 45,
      backgroundColor: theme.palette.primary.main,
      borderRadius: '39px 80px 0 0',
    },
    bottomSideActionButtonRight: {
      zIndex: 100,
      height: 45,
      backgroundColor: theme.palette.primary.main,
      borderRadius: '80px 39px 0 0',
    },
    bottomLineField: {
      width: '90%',
      bottom: 0,
      height: 110,
      position: 'absolute',
      borderBottom: '40px solid #1d04bf',
      borderRadius: '35%',
      marginLeft: '-20%',
      marginBottom: -26,
    },
  })
);

interface IBottomNavigationProps {
  pending?: boolean;
  enabledPrevButton?: boolean;
  enabledActionButton?: boolean;
  enabledAddButton?: boolean;
  onClick?: () => void;
  label?: string;
}

function BottomNavigation({
  pending,
  enabledActionButton,
  enabledAddButton,
  enabledPrevButton,
  onClick,
  label,
}: IBottomNavigationProps) {
  const classes = useStyles();
  const history = useHistory();

  return (
    <div className={classes.bottomMenuBar}>
      <Grid container>
        <Grid item xs={3} className={classes.bottomSideActionButtonLeft}>
          <IconButton
            onClick={() => {
              enabledPrevButton && history.goBack();
            }}
            className={classes.menuButton}
            color="inherit"
          >
            {enabledPrevButton && <NavigateBeforeIcon />}
          </IconButton>
        </Grid>
        <Grid item xs={6}>
          <div className={classes.bottomLineField} />
          {enabledActionButton && (
            <Button
              className={classes.bottomMainActionButton}
              variant="contained"
              onClick={onClick}
              disabled={pending}
            >
              {label}
              {(pending && '중...') || '하기'}
              {pending && (
                <CircularProgress
                  size={10}
                  style={{ position: 'absolute', right: 25 }}
                />
              )}
            </Button>
          )}
        </Grid>
        <Grid item xs={3} className={classes.bottomSideActionButtonRight}>
          <IconButton
            onClick={() => {
              enabledAddButton && history.push('/trip/write');
            }}
            className={classes.menuButton}
            color="inherit"
          >
            {enabledAddButton && <AddIcon />}
          </IconButton>
        </Grid>
      </Grid>
    </div>
  );
}

export default BottomNavigation;
