import firebase from 'firebase';
import 'firebase/firestore';
import { IRoute, IRouteRoutes } from '../models/Route';

class FirebaseService {
  initFirebase() {
    const firebaseConfig = {
      apiKey: 'AIzaSyB3a75crFUTn-8KHYRG7mTzouT_0Ws6u7M',
      authDomain: 'routemaker-e2114.firebaseapp.com',
      databaseURL: 'https://routemaker-e2114.firebaseio.com',
      projectId: 'routemaker-e2114',
      storageBucket: 'routemaker-e2114.appspot.com',
      messagingSenderId: '1009550154903',
      appId: '1:1009550154903:web:334508b5c040d1f0051dd2',
      measurementId: 'G-18Y1T4P245',
    };
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
  }

  getCollection() {
    this.initFirebase();
    const db = firebase.firestore();
    return db.collection('routemaker');
  }

  async hasInviteCode(code: string) {
    const collection = this.getCollection();
    const getDoc = await collection.doc(code).get();
    return getDoc.exists;
  }

  getDoc(id: string) {
    return this.getCollection().doc(id).get();
  }

  updateRegions(routes: IRoute, formData: IRouteRoutes, id: string) {
    const updateRoutes = routes.routes.map((route: IRouteRoutes) => {
      if (route.date === formData.date) {
        return {
          date: formData.date,
          regions: formData.regions,
          budget: formData.budget,
        };
      }
      return route;
    });
    return this.setCollection(
      { notice: routes.notice, routes: updateRoutes },
      id
    );
  }

  setCollection(setData: any, id: string) {
    return this.getCollection().doc(id).set(setData);
  }
}

export default new FirebaseService();
