// scrape_wind_puppeteer.js
// Uses Puppeteer to load the WindAlert spot page, intercepts the network request for the wind graph data, and saves the last 5 hours to CSV.
// Usage: node scrape_wind_puppeteer.js

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
puppeteer.use(StealthPlugin());
import fs from 'fs';
import { createObjectCsvWriter } from 'csv-writer';

const SPOT_URL = 'https://windalert.com/spot/149264';
const OUTPUT = 'wind_data.csv';

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});
// Removed uncaughtException handler for frame detachment

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1280, height: 800 });

    // Use a promise to wait for the graph data
    const graphDataPromise = new Promise((resolve, reject) => {
      page.on('response', async (response) => {
        const url = response.url();
        if (url.includes('/wxengine/rest/graph/getGraph')) {
          try {
            const text = await response.text();
            const match = text.match(/^[^(]+\((.*)\)$/s);
            if (match) {
              const json = JSON.parse(match[1]);
              console.log('Captured graph data from:', url);
              // Immediately process and write CSV here
              try {
                const graphData = json;
                console.log('graphData keys:', Object.keys(graphData));
                console.log('Full graphData:', JSON.stringify(graphData, null, 2));
                const avgArr = graphData.wind_avg_data || [];
                const gustArr = graphData.wind_gust_data || [];
                let dirArr = graphData.wind_dir_data || graphData.wind_direction_data || [];
                if (!dirArr.length && graphData.wind_dir_text_data) dirArr = graphData.wind_dir_text_data;
                if (!avgArr.length || !gustArr.length) {
                  console.error('Missing wind_avg_data or wind_gust_data:', { avgArrLen: avgArr.length, gustArrLen: gustArr.length });
                  await browser.close();
                  process.exit(1);
                }
                const now = new Date(avgArr[avgArr.length - 1][0]);
                const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                // Convert values to numeric and apply validation/conversion
                const convertWindValue = (value) => {
                  // Parse to float and validate
                  const numValue = parseFloat(value);
                  if (isNaN(numValue)) return '';
                  
                  // Convert from kph to mph (1 kph = 0.621371 mph)
                  const mphValue = numValue * 0.621371;
                  
                  // Log the conversion for debugging
                  if (numValue > 60) {
                    console.log(`Converting high value: ${numValue} kph → ${mphValue.toFixed(2)} mph`);
                  }
                  
                  return mphValue.toFixed(2);
                };
                
                const rows = avgArr.map((avg, i) => {
                  const t = avg[0];
                  return {
                    time: new Date(t).toISOString(),
                    windSpeed: convertWindValue(avg[1]),
                    windGust: gustArr[i] ? convertWindValue(gustArr[i][1]) : '',
                    windDirection: dirArr[i] ? dirArr[i][1] : ''
                  };
                }).filter(row => new Date(row.time) >= twentyFourHoursAgo);
                if (rows.length === 0) {
                  console.error('No rows to write to CSV. Check if the data arrays are empty or filtered out.');
                  await browser.close();
                  process.exit(1);
                }
                console.log('Preparing to write CSV. Output path:', OUTPUT);
                console.log('Rows to write:', rows.length, rows.slice(0, 2), rows.slice(-2));
                const csvWriter = createObjectCsvWriter({
                  path: OUTPUT,
                  header: [
                    { id: 'time', title: 'time' },
                    { id: 'windSpeed', title: 'windSpeed' },
                    { id: 'windGust', title: 'windGust' },
                    { id: 'windDirection', title: 'windDirection' }
                  ]
                });
                await csvWriter.writeRecords(rows);
                console.log('CSV write completed.');
                if (rows.length > 0) {
                  console.log('First row:', rows[0]);
                  console.log('Last row:', rows[rows.length - 1]);
                } else {
                  console.log('No rows written to CSV.');
                }
                console.log(`Done. Output: ${OUTPUT}`);
                await browser.close();
                console.log('Browser closed, script done.');
                process.exit(0);
              } catch (err) {
                console.error('Script error (in response handler):', err);
                await browser.close();
                process.exit(1);
              }
            } else {
              console.log('Failed to parse JSONP from:', url);
            }
          } catch (e) {
            console.log('Failed to parse JSONP from:', url, e);
            reject(e);
          }
        }
      });
    });

    await page.goto(SPOT_URL, { waitUntil: 'networkidle2' });
    try {
      await page.waitForSelector('#jwx-graph, .jwx-graph, .highcharts-container', { timeout: 10000 });
      console.log('Graph container detected.');
    } catch (e) {
      console.log('Graph container not detected, continuing after timeout.');
    }
    await page.waitForTimeout(5000);
    // Wait for the graphDataPromise to resolve (which will exit the process)
    await graphDataPromise;
  } catch (err) {
    if (err.message && err.message.includes('Navigating frame was detached')) {
      console.warn('Ignoring Navigating frame was detached error (non-fatal).');
      process.exit(0);
    } else {
      console.error('Script error:', err);
      process.exit(1);
    }
  }
})();
