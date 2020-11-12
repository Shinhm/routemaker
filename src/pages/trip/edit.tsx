import React, { useCallback, useEffect, useState } from 'react';
import FirebaseService from '../../services/FirebaseService';
import { useLocation, useParams } from 'react-router-dom';
import { IRoute, IRouteRoutes } from '../../models/Route';
import qs from 'querystring';
import EncryptService from '../../services/EncryptService';
import Layout from '../../components/_common/layout/Layout';
import {
  createStyles,
  Grid,
  InputAdornment,
  TextField,
  Theme,
  Input,
  Container,
  FormControl,
  InputLabel,
  Button,
  LinearProgress,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { format } from 'date-fns';
import { Form, Formik, FormikProps } from 'formik';
import Map from '../../components/trip/Map';

export enum EDIT_ENTRY {
  write = 'write',
  edit = 'edit',
}

function useQuery() {
  return qs.parse(useLocation().search.replace('?', ''));
}

const useStyles = makeStyles((theme: Theme) =>
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
      height: 60,
      fontSize: 17,
      width: 400,
      position: 'fixed',
      marginLeft: '-200px',
      bottom: 0,
      left: '50%',
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
  })
);

function Edit() {
  const classes = useStyles();
  const { id, edit }: { id: string; edit: string } = useParams();
  const query = useQuery();
  const [pending, setPending] = useState(true);
  const [form, setForm] = useState<IRouteRoutes>({
    date: '',
    regions: [],
  });

  const handleSubmit = async (formData: IRouteRoutes) => {
    const result = await FirebaseService.getDoc(id);
    const { routes = [], notice = '' } = result.data() || {};
    if (!formData.date) {
      return alert('날짜를 입력해주세요.');
    }
    const filter = routes
      .filter((routeFilter: IRouteRoutes) => routeFilter.date === formData.date)
      .pop();
    if (!formData.regions.length) {
      return alert('지역을 추가하셔야 합니다.');
    }
    if (edit === EDIT_ENTRY.write && filter) {
      return alert('이미 해당날짜에 일정을 등록했습니다.');
    }
    try {
      if (edit === EDIT_ENTRY.write) {
        await FirebaseService.setCollection(
          {
            notice: notice,
            routes: routes.concat({
              date: formData.date,
              regions: formData.regions,
              budget: formData.budget,
            }),
          },
          id
        );
      } else {
        const updateRoutes = routes.map((route: IRouteRoutes) => {
          if (route.date === formData.date) {
            return {
              date: formData.date,
              regions: formData.regions,
              budget: formData.budget,
            };
          }
          return route;
        });
        await FirebaseService.setCollection(
          {
            notice: notice,
            routes: updateRoutes,
          },
          id
        );
      }

      window.location.replace(`/${id}/trip`);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchRoute = useCallback(
    async (searchField: string) => {
      try {
        const result = await FirebaseService.getCollection().doc(id).get();
        const { routes } = result.data() as IRoute;
        const getRoutesWithSearchField = routes
          .filter((route) => {
            return route.date === searchField;
          })
          .pop();
        if (getRoutesWithSearchField) {
          setForm(getRoutesWithSearchField);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setPending(false);
      }
    },
    [id]
  );

  useEffect(() => {
    if (edit !== EDIT_ENTRY.edit && edit !== EDIT_ENTRY.write) {
      return window.location.replace(`/${id}/trip`);
    }
    if (edit === EDIT_ENTRY.edit) {
      const q = EncryptService.decrypt(query.q.toString());
      fetchRoute(q).then((r) => r);
    } else {
      setPending(false);
    }
  }, [edit, fetchRoute, id, query.q]);

  return (
    <Layout
      appbar={{
        title: edit === EDIT_ENTRY.edit ? '수정' : '추가',
        id: id,
        enabledPrevButton: true,
      }}
    >
      {pending ? (
        <LinearProgress />
      ) : (
        <Container className={classes.root}>
          <Formik
            initialValues={{
              budget: form.budget || '',
              regions: form.regions,
              date: form.date,
            }}
            enableReinitialize={true}
            onSubmit={handleSubmit}
          >
            {(props: FormikProps<any>) => {
              const { setFieldValue, values, submitForm } = props;
              const { budget, date } = values;
              return (
                <Form>
                  <Grid container spacing={3}>
                    <Grid container item xs={6}>
                      <TextField
                        label="일정"
                        type="date"
                        onChange={(e) => {
                          const date = e.target.value;
                          setFieldValue(
                            'date',
                            format(new Date(date), 'yyyy-MM-dd')
                          );
                        }}
                        defaultValue={date}
                        style={{ width: '100%' }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid container item xs={6}>
                      <FormControl fullWidth>
                        <InputLabel htmlFor="budget">하루예산</InputLabel>
                        <Input
                          id="budget"
                          defaultValue={budget}
                          type={'number'}
                          onChange={(e) => {
                            const budget = e.target.value;
                            setFieldValue('budget', budget);
                          }}
                          startAdornment={
                            <InputAdornment position="start">₩</InputAdornment>
                          }
                        />
                      </FormControl>
                    </Grid>
                    <Grid container item xs={12}>
                      <Map {...props} />
                    </Grid>
                  </Grid>
                  <Button
                    className={classes.submitButton}
                    variant="contained"
                    color="primary"
                    type={'button'}
                    onClick={submitForm}
                  >
                    {edit === EDIT_ENTRY.edit ? '수정하기' : '등록하기'}
                  </Button>
                </Form>
              );
            }}
          </Formik>
        </Container>
      )}
    </Layout>
  );
}

export default Edit;
