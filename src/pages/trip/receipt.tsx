import React, { useCallback, useEffect, useState } from 'react';
import Layout from '../../components/_common/layout/Layout';
import {
  Button,
  ButtonGroup,
  createStyles,
  Divider,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Theme,
} from '@material-ui/core';
import FirebaseService from '../../services/FirebaseService';
import { IRoute, IRouteRoutes, IRouteRoutesPlace } from '../../models/Route';
import EncryptService from '../../services/EncryptService';
import { Link, useLocation, useParams } from 'react-router-dom';
import qs from 'querystring';
import { makeStyles } from '@material-ui/core/styles';
import { format } from 'date-fns';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';

function useQuery() {
  return qs.parse(useLocation().search.replace('?', ''));
}

const useStyles = makeStyles((theme: Theme) =>
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

function Receipt() {
  const classes = useStyles();
  const { id }: { id: string } = useParams();
  const query = useQuery();
  const [pending, setPending] = useState(true);
  const [receiptInfo, setReceiptInfo] = useState<IRouteRoutes>();
  const [totalAmount, setTotalAmount] = useState(0);
  const [personCount, setPersonCount] = useState(1);

  const fetchRoute = useCallback(
    async (searchField: string) => {
      try {
        const result = await FirebaseService.getCollection('routeMaker')
          .doc(id)
          .get();
        const { routes } = result.data() as IRoute;
        const getRoutesWithSearchField = routes
          .filter((route) => {
            return route.date === searchField;
          })
          .pop();
        if (getRoutesWithSearchField) setReceiptInfo(getRoutesWithSearchField);
        let routesTotalAmount: number = 0;
        getRoutesWithSearchField?.regions.forEach((a: IRouteRoutesPlace) => {
          routesTotalAmount += a.amount ? parseInt(a.amount) : 0;
        });
        setTotalAmount(routesTotalAmount);
      } catch (e) {
        console.log(e);
      } finally {
        setPending(false);
      }
    },
    [id]
  );

  const handlePersonCount = (action: string) => {
    let person = personCount;
    if (action === 'plus' && person < 9) {
      person++;
    }
    if (action === 'minus' && person !== 1) {
      person--;
    }
    setPersonCount(person);
  };

  useEffect(() => {
    if (!query.q) {
      alert('정상접근이 아닙니다.');
      return window.location.replace(`/enter`);
    }

    const q = EncryptService.decrypt(query.q.toString());
    fetchRoute(q).then((r) => r);
  }, [fetchRoute, query.q]);

  return (
    <Layout appBar={{ title: '영수증', id: id, enabledPrevButton: true }}>
      {pending && <LinearProgress />}
      {!pending && receiptInfo && (
        <>
          <Paper className={classes.root} elevation={3}>
            <Grid
              container
              direction="row"
              justify="space-around"
              alignItems="center"
              spacing={3}
            >
              <Grid item xs={12}>
                <h4 style={{ paddingLeft: 8 }}>
                  {format(new Date(receiptInfo.date), 'yyyy년 MM월 dd일')}
                </h4>
                <h1>
                  {totalAmount.toLocaleString()}
                  <span className={classes.amountUnit}>원</span>
                </h1>
              </Grid>
              <Grid item xs={12}>
                <Grid
                  container
                  direction="row"
                  justify="space-around"
                  alignItems="center"
                >
                  <Grid item xs={receiptInfo.budget ? 6 : 12}>
                    <ButtonGroup
                      className={classes.buttonGroup}
                      size="small"
                      aria-label="small outlined button group"
                    >
                      <Button
                        onClick={() => {
                          handlePersonCount('minus');
                        }}
                      >
                        <RemoveIcon />
                      </Button>
                      <Button>{personCount}명</Button>
                      <Button
                        onClick={() => {
                          handlePersonCount('plus');
                        }}
                      >
                        <AddIcon />
                      </Button>
                    </ButtonGroup>
                  </Grid>
                  {receiptInfo.budget && (
                    <Grid item xs={6} className={classes.budgetField}>
                      하루예산: {parseInt(receiptInfo.budget).toLocaleString()}
                      원
                    </Grid>
                  )}
                </Grid>
                <Divider className={classes.solidDivider} variant="middle" />
              </Grid>
              <Grid item xs={12}>
                <List dense={true}>
                  {receiptInfo.regions.map((region) => {
                    if (!region.amount) return false;
                    return (
                      <ListItem>
                        <ListItemText
                          className={classes.listItem}
                          primary={region.place_name}
                          secondary={region.address_name}
                        />
                        <ListItemSecondaryAction>
                          <span style={{ fontWeight: 'bold' }}>
                            {parseInt(region.amount || '0').toLocaleString()}원
                          </span>
                        </ListItemSecondaryAction>
                      </ListItem>
                    );
                  })}
                </List>
              </Grid>
              <Grid item xs={12}>
                <List dense={true}>
                  <ListItem>
                    <ListItemText
                      className={classes.totalItem}
                      primary={'총 금액'}
                    />
                    <ListItemSecondaryAction>
                      <span className={classes.totalAmount}>
                        {totalAmount.toLocaleString()} 원
                      </span>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      className={classes.totalItem}
                      primary={'1인당 금액'}
                    />
                    <ListItemSecondaryAction>
                      <span className={classes.totalAmount}>
                        {parseInt(
                          (totalAmount / personCount).toFixed(0)
                        ).toLocaleString()}{' '}
                        원
                      </span>
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
                <p
                  style={{
                    textAlign: 'center',
                    opacity: 0.6,
                    padding: '10px 0 5px',
                  }}
                >
                  * 1인당 금액은 인원변경이 되면 자동으로 계산됩니다.
                </p>
              </Grid>
            </Grid>
          </Paper>
          <Link to={`/${id}/trip`}>
            <Button variant="outlined" color="primary">
              확인
            </Button>
          </Link>
        </>
      )}
    </Layout>
  );
}

export default Receipt;
