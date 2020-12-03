import { makeStyles } from '@material-ui/core/styles';
import { createStyles, Theme } from '@material-ui/core';

export const useEditStyle = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: ' 20px auto',
    },
    menuButton: {
      color: '#fff',
    },
    title: {
      flexGrow: 1,
      textAlign: 'left',
      color: '#fff',
    },
    floatButton: {
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
      zIndex: 999999,
    },
    submitButton: {
      backgroundColor: theme.palette.primary.main,
      color: '#fff',
      height: 50,
      fontSize: 17,
      width: 700,
      fontWeight: 500,
      position: 'fixed',
      marginLeft: '-350px',
      bottom: 0,
      left: '50%',
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
    submitButtonMobile: {
      backgroundColor: theme.palette.primary.main,
      color: '#fff',
      height: 50,
      fontSize: 17,
      width: 400,
      fontWeight: 500,
      position: 'fixed',
      marginLeft: '-200px',
      bottom: 0,
      left: '50%',
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
  })
);
