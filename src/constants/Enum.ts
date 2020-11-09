export enum REGION_CATEGORY {
  MT1 = 'MT1',
  CS2 = 'CS2',
  PS3 = 'PS3',
  SC4 = 'SC4',
  AC5 = 'AC5',
  PK6 = 'PK6',
  OL7 = 'OL7',
  SW8 = 'SW8',
  BK9 = 'BK9',
  CT1 = 'CT1',
  AG2 = 'AG2',
  PO3 = 'PO3',
  AT4 = 'AT4',
  AD5 = 'AD5',
  FD6 = 'FD6',
  CE7 = 'CE7',
  HP8 = 'HP8',
  PM9 = 'PM9',
}

class Enum {
  possibleCategory(code: string) {
    const possibleCode = [
      REGION_CATEGORY.MT1,
      REGION_CATEGORY.CS2,
      REGION_CATEGORY.PK6,
      REGION_CATEGORY.OL7,
      REGION_CATEGORY.SW8,
      REGION_CATEGORY.AD5,
      REGION_CATEGORY.FD6,
      REGION_CATEGORY.CE7,
    ];
    const isPossibleCode = possibleCode.filter((pCode) => {
      return pCode === code;
    });
    return !!isPossibleCode.length;
  }
}

export default new Enum();
