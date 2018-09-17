export const scrape = async (cusip, from, to, page) => {
  console.log('scraping...', {cusip, from, to});
  await page.goto('https://emma.msrb.org/');
  await page.waitFor(1000);

  try {
    await page.evaluate(cusipValue => {
      document.querySelector('#quickSearchText').value = cusipValue;
    }, cusip);
  } catch (err) {
    // console.log('Something bad happened: ', err);
    throw err;
  }

  await page.waitFor(2000);
  await page.click('#quickSearchButton');
  await page.waitFor(5000);
  if (
    (await page.$('#ctl00_mainContentArea_disclaimerContent_yesButton')) !==
    null
  ) {
    await page.click('#ctl00_mainContentArea_disclaimerContent_yesButton');
  }

  await page.waitFor(25000);
  try {
    await page.click('#searchTab');
  } catch (err) {
    // console.log('elem from page click does not exist', err);
    throw err;
  }

  // await page.waitFor(15000);

  await page.evaluate(
    (fromValue, toValue) => {
      document.querySelector('#tradeDateFrom').value = fromValue;
      document.querySelector('#tradeDateTo').value = toValue;
      document.querySelector('#searchTradeActivityButton').click();
    },
    from,
    to
  );

  await page.waitFor(10000);

  try {
    const {data} = await page.evaluate(() => tradeData);
    return {cusip, data};
  } catch (err) {
    throw err;
  }
};
