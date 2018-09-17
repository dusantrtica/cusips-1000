/*
{"STL":"2018-09-05T00:00:00","SIX":"A09583A3B035A39F9E039C48ED7B9B863","SDX":"STATE OF TEXAS / TAX AND REVENUE ANTICIPATION NOTES SERIES 2018","MDX":"2019-08-29T00:00:00","ITX":4,"TDT":"2018-08-31T14:21:13","PX":102.09,"YX":1.831,"TA":25000,"TT":"S","WI":"Y","BI":null,"PI":null,"LI":null,"AT":null,"NT":"Y","UI":null,"AI":null,"CT":"YIELD","CDP":"08/29/2019 <BR/>@ 100"}
*/
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

const convertRow = (row) => {
  const {
    TDT: tradeDateTime,
    STL: settlementDate,
    PX: price,
    YX: yx,
    CDP: calculationDateAndPrice,
    TA: tradeAmount,
    TT: tradeType,
    AT,
    BI,
    LI,
    NT,
    PI,
    WI,
  } = row;

  const specialCondition = `${AT ? 'A' : ''}${BI ? 'B' : ''}${LI ? 'L' : ''}${
    NT ? 'N' : ''
  }${PI ? 'P' : ''}${WI ? 'W' : ''}`;

  return {
    tradeType,
    tradeAmount,
    calculationDateAndPrice,
    yx,
    price,
    settlementDate,
    tradeDateTime,
    specialCondition,
  };
};

export const prepareRowForCSVOutput = (row) => {
  const {
    tradeType,
    tradeAmount,
    calculationDateAndPrice,
    yx,
    price,
    settlementDate,
    tradeDateTime,
    specialCondition,
  } = row;

  return [
    tradeDateTime,
    settlementDate,
    price,
    yx,
    calculationDateAndPrice,
    tradeAmount,
    tradeType,
    specialCondition,
  ];
};

export const convertRows = rows => rows.map(convertRow);
