import React from 'react';
import {
  Button,
  CircularProgress,
  createStyles,
  Fab,
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
      // color: '#fff',
    },
    bottomMenuBar: {
      width: '100%',
      left: 0,
      [theme.breakpoints.up('sm')]: {
        left: '50%',
        width: theme.breakpoints.width('lg'),
        marginLeft: -(theme.breakpoints.width('lg') / 2),
      },
      position: 'fixed',
      bottom: 0,
      zIndex: 10,
    },
    bottomMainActionButton: {
      // width: '95%',
      // border: '1px solid',
      // borderColor: theme.palette.primary.main,
      // borderRadius: 50,
      // marginBottom: '15%',
      // fontWeight: 700,
      // [theme.breakpoints.up('sm')]: {
      //   fontSize: 15,
      //   height: 60,
      //   marginTop: -60,
      // },
      position: 'fixed',
      bottom: 25,
      left: '50%',
      zIndex: 20,
      width: 150,
      transform: 'translateX(-50%)',
      fontWeight: 700,
      borderRadius: 50,
      [theme.breakpoints.up('sm')]: {
        width: 340,
        fontSize: 15,
        height: 60,
      },
    },
    bottomSideActionButton: {
      position: 'fixed',
      bottom: 25,
      left: '50%',
      zIndex: 20,
      marginLeft: theme.breakpoints.width('lg') / 2 - 70,
      [theme.breakpoints.down('sm')]: {
        marginLeft: theme.breakpoints.width('sm') / 2 - 70,
        width: 36,
        height: 36,
      },
      transform: 'translateX(-50%)',
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
    <>
      <Grid container>
        <Grid item xs={3}>
          {UserAgentService.isMobile() && enabledPrevButton && (
            <Button
              className={classes.bottomSideActionButton}
              onClick={() => {
                enabledPrevButton && history.goBack();
              }}
              variant="outlined"
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
              color="primary"
              onClick={onClick}
              disabled={pending}
            >
              {label}
              {pending && (
                <CircularProgress
                  size={10}
                  color={'inherit'}
                  style={{ position: 'absolute', right: 25 }}
                />
              )}
            </Button>
          )}
        </Grid>
      </Grid>

      {enabledAddButton && (
        <Fab
          aria-label={'add button'}
          className={classes.bottomSideActionButton}
          color={'primary'}
          onClick={() => {
            enabledAddButton && history.push(`/${id}/write`);
          }}
        >
          <AddIcon />
        </Fab>
      )}
    </>
  );
}

export default BottomNavigation;
