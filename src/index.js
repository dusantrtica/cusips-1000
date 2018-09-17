#!./node_modules/.bin/babel-node --
import fs from 'fs';
import puppeteer from 'puppeteer';
import chalk from 'chalk';
import program from 'commander';
import moment from 'moment';
import {scrape} from './data-scraper';
import {storeCusipInformation} from './data-persister';

const isValidCusipName = cusip =>
  cusip.indexOf('.') < 0 && cusip.indexOf('+') < 0;

const parseCusips = (cusipsStr, reverse) => {
  const cusips = cusipsStr
    .split('\n')
    .filter(cusip => cusip && isValidCusipName(cusip));
  if (reverse) {
    console.log('reversing cusips');
    cusips.reverse();
  }

  return cusips;
};

const loadCusips = async program => {
  let cusips = '';
  if (program.cusips) {
    return program.cusips.split(',');
  }
  if (program.input) {
    const fd = fs.createReadStream(program.input);
    fd.on('data', data => {
      cusips += data;
      cusips = cusips.replace(/"/g, '');
    });

    const end = new Promise((resolve, reject) => {
      fd.on('end', () => resolve(parseCusips(cusips, program.reverse)));
      fd.on('error', reject);
    });

    return end;
  }
};

const scrapeAllCusips = async (cusips, from, to) => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();

  for (const cusip of cusips) {
    try {
      const cusipDataset = await scrape(cusip, from, to, page);
      console.log(`Fetching data for ${cusip} done, writing to csv...`);
      if (cusipDataset.data) {
        await storeCusipInformation(cusipDataset);
        console.log(chalk.green(`${cusip}.csv`));
      } else {
        console.log(chalk.red('failed to scrape ', cusip));
      }
    } catch (err) {
      console.log(chalk.red('scrape failed for ', cusip));
    }
  }

  await page.close();
  await browser.close();

  console.log('Done!');
};

program
  .version('0.1.0')
  .option('-f --from [value]', 'Add from date in format: MM/DD/YYYY')
  .option('-t --to [value]', 'Add to date in format MM/DD/YYYY')
  .option('-i --input [value]', 'Input file with Cusips')
  .option('-c --cusips <list>', 'List of cusips separated by comma')
  .option('-r --reverse', 'Start processing backward')
  .option('-o --override', 'Override existing files')
  .parse(process.argv);

const from = program.from || '01/01/2014';
const to = program.to || moment().format('MM/DD/YYYY');

loadCusips(program).then(async cusips => {
  const newCusips = program.override
    ? cusips
    : cusips.filter(cusip => !fs.existsSync(`output/${cusip}.csv`));
  console.log('total number of newCusips ', newCusips.length);
  await scrapeAllCusips(newCusips, from, to);
});
