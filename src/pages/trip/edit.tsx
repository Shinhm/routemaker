import React, { useEffect, useState } from 'react';
import FirebaseService from '../../services/FirebaseService';
import { useLocation, useParams } from 'react-router-dom';
import { IRoute, IRouteRoutes, IRouteRoutesRegion } from '../../models/Route';
import qs from 'querystring';
import EncryptService from '../../services/EncryptService';
import './edit.scss';
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
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { format } from 'date-fns';
import { Form, Formik, FormikProps } from 'formik';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import Regions from '../../components/trip/Regions';
import Map from '../../components/trip/Map';

enum EDIT_ENTRY {
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
    map: {
      width: 350,
      height: 350,
    },
    submitButton: {
      backgroundColor: theme.palette.primary.main,
      color: '#fff',
      height: 60,
      fontSize: 17,
      width: '100%',
      position: 'fixed',
      bottom: 0,
      left: 0,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
  })
);

function Edit() {
  const classes = useStyles();
  const { id, edit }: { id: string; edit: string } = useParams();
  const query = useQuery();
  const [form, setForm] = useState<IRouteRoutes>({
    date: '',
    regions: [],
  });

  const handleRemovePlace = (count: number) => {
    setForm((currentValue) => {
      console.log(currentValue.regions.splice(0, 1));
      console.log(currentValue.regions.slice(count, count + 1));
      return {
        ...currentValue,
        regions: currentValue.regions,
      };
    });
  };

  const handleSubmit = async (formData: IRouteRoutes) => {
    const collection = FirebaseService.getCollection();
    const result = await collection.doc(id).get();
    const { routes = [], notice = '' } = result.data() || {};
    const filter = routes
      .filter((routeFilter: IRouteRoutes) => routeFilter.date === formData.date)
      .pop();
    console.log(formData);
    if (!formData.regions.length) {
      return alert('지역을 추가하셔야 합니다.');
    }
    if (edit === EDIT_ENTRY.write && filter) {
      return alert('이미 해당날짜에 일정을 등록했습니다.');
    }
    try {
      if (edit === EDIT_ENTRY.write) {
        await collection.doc(id).set({
          notice: notice,
          routes: routes.concat({
            date: form.date,
            regions: form.regions,
          }),
        });
      } else {
        const updateRoutes = routes.map((route: IRouteRoutes) => {
          if (route.date === form.date) {
            return {
              date: form.date,
              regions: form.regions,
            };
          }
          return route;
        });
        // await collection.doc(id).set({
        //   notice: notice,
        //   routes: updateRoutes,
        // });
      }

      // window.location.replace(`/${id}/trip`);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchRoute = async (searchField: string) => {
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
    }
  };

  useEffect(() => {
    if (edit !== EDIT_ENTRY.edit && edit !== EDIT_ENTRY.write) {
      return window.location.replace(`/${id}/trip`);
    }
    if (edit === EDIT_ENTRY.edit) {
      const q = EncryptService.decrypt(query.q.toString());
      fetchRoute(q);
    }
  }, []);

  return (
    <Layout appbar={{ title: '추가', id: id, enabledPrevButton: true }}>
      <Container className={classes.root}>
        <Formik
          initialValues={{
            budget: '',
            regions: form.regions,
            date: form.date,
          }}
          onSubmit={handleSubmit}
        >
          {(props: FormikProps<any>) => {
            const { setFieldValue, values, submitForm } = props;
            const { date, budget } = values;
            return (
              <Form>
                <Grid container spacing={3}>
                  <Grid container item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel htmlFor="budget">예산</InputLabel>
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
                  <Grid container item xs={6}>
                    <TextField
                      id="date"
                      label="일정"
                      type="date"
                      name={'date'}
                      onChange={(e) => {
                        const date = e.target.value;
                        setFieldValue('date', new Date(date));
                      }}
                      style={{ width: '100%' }}
                      defaultValue={format(date || new Date(), 'yyyy-MM-dd')}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
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
                  등록하기
                </Button>
              </Form>
            );
          }}
        </Formik>
      </Container>
    </Layout>
  );
}

export default Edit;
