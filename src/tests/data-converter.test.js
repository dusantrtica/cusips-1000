import {
  convertRows,
  prepareRowForCSVOutput,
  __RewireAPI__ as rewireDataConverter,
} from '../data-converter';

describe('prepareRowForCSVOutput', () => {
  it('should output array of items for give row', () => {
    const row = {
      tradeType: 1,
      tradeAmount: 2,
      calculationDateAndPrice: 3,
      yx: 4,
      price: 5,
      settlementDate: 6,
      tradeDateTime: 7,
      specialCondition: 8,
    };

    expect(prepareRowForCSVOutput(row)).toEqual([7, 6, 5, 4, 3, 2, 1, 8]);
  });
});

describe('convertRow', () => {
  const convertRow = rewireDataConverter.__get__('convertRow');
  it('should convert specialCondition where all the letters are non null', () => {
    const {specialCondition} = convertRow({
      AT: 1,
      BI: 2,
      LI: 3,
      NT: 4,
      WI: 5,
      PI: 6,
    });

    expect(specialCondition).toBe('ABLNPW');
  });
  it('should convert all the items in the row properly', () => {
    const rowExample = {
      STL: '2018-09-05T00:00:00',
      SIX: 'A09583A3B035A39F9E039C48ED7B9B863',
      SDX: 'STATE OF TEXAS / TAX AND REVENUE ANTICIPATION NOTES SERIES 2018',
      MDX: '2019-08-29T00:00:00',
      ITX: 4,
      TDT: '2018-08-31T14:21:13',
      PX: 102.09,
      YX: 1.831,
      TA: 25000,
      TT: 'S',
      WI: 'Y',
      BI: null,
      PI: null,
      LI: null,
      AT: null,
      NT: 'Y',
      UI: null,
      AI: null,
      CT: 'YIELD',
      CDP: '08/29/2019 <BR/>@ 100',
    };

    expect(convertRow(rowExample)).toEqual({
      tradeDateTime: '2018-08-31T14:21:13',
      settlementDate: '2018-09-05T00:00:00',
      price: 102.09,
      yx: 1.831,
      calculationDateAndPrice: '08/29/2019 <BR/>@ 100',
      tradeAmount: 25000,
      tradeType: 'S',
      specialCondition: 'NW',
    });
  });
});
