import { makeStyles } from '@material-ui/core/styles';
import { createStyles, Theme } from '@material-ui/core';

export const useUserStyle = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '20px 60px',
      [theme.breakpoints.down('md')]: {
        padding: '20px 10px',
      },
    },
    avatar: {
      width: 150,
      height: 150,
      [theme.breakpoints.down('md')]: {
        width: 60,
        height: 60,
      },
    },
    gridRoot: {
      padding: '30px 10px',
    },
    favoriteIcon: {
      color: '#ed4956',
      backgroundColor: 'transparent',
    },
    pickIcon: {
      color: theme.palette.text.secondary,
      backgroundColor: 'transparent',
    },
    allIcon: {
      color: theme.palette.primary.main,
      backgroundColor: 'transparent',
    },
    makeButton: {
      marginLeft: 10,
      fontSize: 11,
      [theme.breakpoints.down('md')]: {
        fontSize: 10,
        padding: 5,
      },
    },
    titleField: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingLeft: 25,
      [theme.breakpoints.down('md')]: {
        padding: 0,
        justifyContent: 'flex-end',
      },
    },
  })
);
