import React from 'react';
import {
  Button,
  CircularProgress,
  createStyles,
  Grid,
  Theme,
} from '@material-ui/core';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import UserAgentService from '../../../services/UserAgentService';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuButton: {
      color: '#fff',
    },
    bottomMenuBar: {
      width: '100%',
      height: 35,
      left: 0,
      [theme.breakpoints.up('sm')]: {
        left: '50%',
        width: theme.breakpoints.width('lg'),
        marginLeft: -(theme.breakpoints.width('lg') / 2),
      },
      position: 'fixed',
      bottom: 0,
      zIndex: 99999,
    },
    bottomMainActionButton: {
      width: '95%',
      background: '#fff',
      border: '1px solid',
      borderColor: theme.palette.primary.main,
      borderRadius: 50,
      marginTop: -7,
      [theme.breakpoints.up('sm')]: {
        height: 50,
        marginTop: -25,
      },
    },
    bottomSideActionButton: {
      marginTop: -7,
      border: '1px solid',
      background: '#fff',
      borderColor: theme.palette.primary.main,
      borderRadius: 50,
      height: 35,
      '& span': {
        lineHeight: 1,
        color: theme.palette.primary.main,
      },
      [theme.breakpoints.up('sm')]: {
        height: 60,
        marginTop: -60,
      },
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
  id?: string;
}

function BottomNavigation({
  pending,
  enabledActionButton,
  enabledAddButton,
  enabledPrevButton,
  onClick,
  label,
  id,
}: IBottomNavigationProps) {
  const classes = useStyles();
  const history = useHistory();

  return (
    <div className={classes.bottomMenuBar}>
      <Grid container>
        <Grid item xs={3}>
          {UserAgentService.isMobile() && enabledPrevButton && (
            <Button
              className={classes.bottomSideActionButton}
              onClick={() => {
                enabledPrevButton && history.goBack();
              }}
              color="inherit"
            >
              {<NavigateBeforeIcon />}
            </Button>
          )}
        </Grid>
        <Grid item xs={6}>
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
        <Grid item xs={3}>
          {enabledAddButton && (
            <Button
              onClick={() => {
                enabledAddButton && history.push(`/${id}/write`);
              }}
              className={classes.bottomSideActionButton}
              color="inherit"
            >
              {enabledAddButton && <AddIcon />}
            </Button>
          )}
        </Grid>
      </Grid>
    </div>
  );
}

export default BottomNavigation;
