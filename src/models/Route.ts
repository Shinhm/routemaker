export interface IRoute {
  routes: IRouteRoutes[];
  notice?: string;
}

export interface IRouteRoutes {
  budget?: string;
  date: string;
  regions: IRouteRoutesPlace[];
}

export interface IRouteRoutesPlace {
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

export interface IRouteRoutesGeoCode {
  address: IRouteRoutesGeoCodeAddress;
  address_name: string;
  address_type: string;
  road_address: RoadAddress;
  x: string;
  y: string;
  time?: string;
  amount?: string;
}

export interface IRouteRoutesGeoCodeAddress {
  address_name: string;
  b_code: string;
  h_code: string;
  main_address_no: string;
  mountain_yn: string;
  region_1depth_name: string;
  region_2depth_name: string;
  region_3depth_h_name: string;
  region_3depth_name: string;
  sub_address_no: string;
  x: string;
  y: string;
}

export interface RoadAddress {
  address_name: string;
  building_name: string;
  main_building_no: string;
  region_1depth_name: string;
  region_2depth_name: string;
  region_3depth_name: string;
  road_name: string;
  sub_building_no: string;
  underground_yn: string;
  x: string;
  y: string;
  zone_no: string;
}
