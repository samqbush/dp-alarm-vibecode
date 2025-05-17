# Wind Trend Analyzer for Bear Creek Lake

This application scrapes wind data from WindAlert for Bear Creek Lake, CO (Soda Lake Dam 1), visualizes it with focus on the early morning hours (2am-7am window), and analyzes wind conditions between 3am-5am to determine if they're favorable for beach activities.

## Features
- Uses Puppeteer with stealth plugins to avoid detection
- Fetches 24 hours of wind data from WindAlert
- Converts wind speeds from kph to mph
- Outputs data in CSV format
- **Visualizes data with interactive HTML charts focusing on the 2am-7am window**
- **Highlights the 3am-5am period for trend analysis**
- **Shows wind direction with intuitive directional arrows**
- **Analyzes trend consistency during 3am-5am to determine "alarm worthiness"**
- **User-configurable alarm criteria for customized alerts**
- **Visual indicators for wind quality and consistency**
- **Mobile-friendly responsive design**
- **Dark mode support with automatic system preference detection**
- **Interactive UI with refresh button and improved visualization**

## Prerequisites
- Node.js (v16 or higher recommended)
- npm (Node Package Manager)

## Installation
1. Clone this repository or download the source code.
2. Install dependencies:
   ```sh
   npm install
   ```

## Usage
To run the complete application (scrape data and open visualization):

```sh
npm start
```

This will:
1. Run the wind data scraper to fetch 24 hours of data
2. Start a local web server
3. Open the visualization in your default browser

The visualization will:
- Focus on the 2am-7am window
- Highlight the 3am-5am period with yellow background
- Show vertical marker lines at 3am and 5am
- Analyze wind trends to determine if conditions are "alarm worthy"
- Provide configurable alarm settings through the "⚙️ Alarm Settings" button

If you prefer to run the steps separately:

```sh
# Only scrape data
npm run scrape

# Manually start the server
npx http-server . -p 8080
```

### Alarm Worthiness Determination

The application determines if wind conditions are "alarm worthy" (i.e., favorable for beach activities) based on:

1. **Average wind speed** - Minimum 10 mph average during the 3am-5am window
2. **Direction consistency** - At least 70% consistency in wind direction
3. **Consecutive good conditions** - At least 4 consecutive data points (≈1 hour) with:
   - Speed at least 8 mph
   - Direction variation less than 40°

The alarm status will show as:
- **✅ ALARM WORTHY** - Good conditions detected
- **⚠️ MARGINAL** - Some good conditions but not optimal
- **❌ NOT ALARM WORTHY** - Poor conditions

## Data Details
The application scrapes wind data from WindAlert and:
- Converts wind speeds from kph to mph for display
- Analyzes the 3am-5am window for favorable conditions
- Provides visual indicators (arrows) for wind direction
- Summarizes wind trends to determine if conditions meet your criteria

## Project Structure
- `scrape_wind_puppeteer.js`: Main script for scraping wind data
- `wind_visualization.html`: HTML/JS visualization of wind data
- `wind_visualization_dark_mode.html`: Enhanced visualization with dark mode and additional features
- `wind_data.csv`: Generated CSV file with scraped data
- `wind-app.js`: Combined script that runs both scraper and visualization
- `package.json`: Project configuration and dependencies

## Future Enhancements
- Mobile notifications for good wind conditions
- Weather forecast integration for multi-day planning
- Historical data storage and trend analysis over multiple days
- User-configurable time windows (beyond the current 3am-5am focus)
- PWA (Progressive Web App) support for better mobile experience

## Notes
- The script uses Puppeteer Extra and the Stealth plugin to minimize detection by WindAlert.
- Make sure you have a stable internet connection when running the scraper.
- The visualization features both light and dark modes that automatically detect system preferences.
- For best experience, view the visualization on a desktop or tablet device.
- The 3am-5am window is highlighted as this is the critical time to determine if conditions are favorable for beach activities.

## Alarm Worthiness Logic
The application determines if wind conditions are favorable (alarm worthy) based on configurable criteria:

1. **Average wind speed** - Minimum average wind speed during 3am-5am (default: 10 mph)
2. **Direction consistency** - Minimum percentage of consistent direction (default: 70%)
3. **Consecutive good conditions** - Minimum number of consecutive data points (default: 4) with:
   - Speed above the minimum point threshold (default: 8 mph)
   - Direction variation below the maximum deviation threshold (default: 40°)

All these parameters are fully configurable through the settings panel, allowing you to customize the alarm criteria to match your personal preferences for beach activities. Your settings are automatically saved in your browser for future visits.

These criteria ensure you're only woken up when conditions are truly worthwhile for your specific beach activities.

## License
MIT License
