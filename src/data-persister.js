import fs from 'fs';
import csv from 'fast-csv';
import {prepareRowForCSVOutput, convertRows} from './data-converter';

export const storeCusipInformation = async cusipDataset => {
  const {cusip, data} = cusipDataset;
  const convertedData = [
    [
      'Trade Date/Time',
      'Settlement Date',
      'Price (%)',
      'Yield (%)',
      'Calculation Date & Price (%)',
      'Trade Amount ($)',
      'Trade Type',
      'Special Condition',
    ],
    ...convertRows(data).map(prepareRowForCSVOutput),
  ];
  const ws = fs.createWriteStream(`output/${cusip}.csv`);
  csv.write(convertedData, {headers: true}).pipe(ws);
};

const testOutput = async () => {
  const rows = [
    {
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
    },
    {
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
    },
    {
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
    },
  ];

  const tradeData = {cusip: '123123123', data: rows};

  await storeCusipInformation(tradeData);
};

// testOutput();
