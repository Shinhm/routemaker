import { makeStyles } from '@material-ui/core/styles';
import { createStyles, Theme } from '@material-ui/core';

export const useReceiptStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: '30px 15px',
      padding: 30,
      textAlign: 'left',
      letterSpacing: -2,
      lineHeight: 1,
    },
    amountUnit: {
      fontSize: 19,
      marginLeft: 5,
    },
    solidDivider: {
      margin: '20px 0 0',
      height: 3,
      backgroundColor: '#000',
    },
    budgetField: {
      letterSpacing: 0,
      textAlign: 'right',
      fontSize: 14,
      fontWeight: 500,
    },
    listItem: {
      '& span': {
        fontSize: 15,
      },
      '& p': {
        fontSize: 13,
      },
    },
    totalItem: {
      '& span': {
        fontSize: 17,
        color: theme.palette.primary.main,
      },
    },
    totalAmount: {
      fontSize: 17,
      color: theme.palette.primary.main,
    },
    buttonGroup: {
      '& button': {
        padding: 0,
      },
    },
  })
);
