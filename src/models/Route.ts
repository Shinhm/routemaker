export interface IRoute {
  routes: IRouteRoutes[];
  notice?: string;
}

export interface IRouteRoutes {
  budget?: string;
  date: string;
  regions: IRouteRoutesRegion[];
}

export interface IRouteRoutesRegion {
  address_name: string;
  category_group_code: string;
  category_group_name: string;
  category_name: string;
  distance: string;
  id: string;
  phone: string;
  place_name: string;
  place_url: string;
  road_address_name: string;
  x: string;
  y: string;
  time?: string;
  amount?: string;
}
