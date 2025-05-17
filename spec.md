# Wind Trend Checker for Soda Lake – Feature Specification

## Purpose
Automatically check and visualize wind trends (average speed, gusts, direction) at Bear Creek Lake, CO, between 3am–5am to decide if it’s worth waking up early for the beach.

### Location
[Soda Lake Dam 1](https://www.openstreetmap.org/node/358940663)
Location: 39.6463156, -105.1769522

## User
- Primary user: Yourself (and potentially others with similar needs)

## Problem Solved
- Saves time and effort by providing actionable wind trend data before you wake up.

## Current Status
- **WindAlert.com** selected as the primary data source (scraping tested and automated)
- Data fetching and visualization scripts are combined and automated
- 24 hours of wind data are fetched and stored in CSV format
- Visualization focuses on the 2am–7am window, with special highlighting and analysis for 3am–5am
- Alarm-worthiness logic implemented based on speed, direction, and consistency
- User-configurable alarm criteria with settings panel and local storage persistence
- Modern, mobile-friendly, and dark-mode-enabled visualization is available
- Documentation and codebase are up to date

## Key Functionalities
- Fetch wind data (average, gusts, direction) for a specific location and time window
- Visualize the trend (as an interactive graph)
- Configurable alarm criteria for customized alerts based on user preferences
- Run automatically before you wake up
- Start with a desktop solution, then move to mobile

## Constraints
- No major constraints; open to scraping or using public APIs

## Step-by-Step Feature Plan

1. **Data Source Evaluation (Complete)**
   - Evaluated three sources: windalert.com, Weatherlink API, Meteoblue APIs
   - WindAlert.com chosen for reliability and accessibility

2. **Data Fetching Script (Complete)**
   - Script reliably fetches 24 hours of wind data for Bear Creek Lake
   - Parses and stores average speed, gusts, and direction in a CSV file

3. **Visualization (Complete)**
   - Interactive HTML/JS tool visualizes wind trends for the 2am–7am window
   - 3am–5am window is highlighted and analyzed for alarm-worthiness
   - User-configurable alarm criteria with settings panel for customization
   - Dark mode and mobile responsiveness implemented
   - Wind direction arrows and summary/analysis included

4. **Monitoring & Automation (In Progress)**
   - Script can be scheduled (e.g., with cron) to run before wake-up time
   - Manual and automated runs both supported
   - Need to set up and test scheduled automation for reliability

5. **Review & Iterate (Ongoing)**
   - Adjust data source, visualization, or automation as needed based on real-world results
   - Continue to monitor and refine alarm logic and UI/UX

6. **(Future) Mobile Integration**
   - Plan for mobile notification or alarm integration (e.g., push notifications, SMS, or app)
   - Consider PWA (Progressive Web App) for direct mobile access

## Mobile App Planning (Android)

### Approach
- Use a cross-platform framework (such as React Native or Flutter) to build the mobile app, allowing for future iOS support if desired.
- The app will initially target Android and be tested on your personal device.
- The app will fetch and display the same wind data and alarm-worthiness analysis as the desktop version.
- The backend (data scraping and CSV generation) will remain on your server or desktop, and the app will fetch the latest data via HTTP (e.g., from a public or local endpoint).

### MVP Features
- Simple, mobile-friendly UI showing:
  - Wind speed, gust, and direction for the 2am–7am window
  - Highlighted 3am–5am window with alarm-worthiness analysis
  - User-configurable alarm criteria settings
  - Visual wind direction indicators (arrows or compass)
  - Dark mode support
  - Manual refresh button
- Fetches data from your server (e.g., by downloading the latest CSV or JSON)
- Works offline with last-fetched data (optional for MVP)

### Next Steps
1. Choose a framework (React Native recommended for fastest prototyping)
2. Scaffold a new mobile app project
3. Implement a simple screen that fetches and displays the wind data (start with static data, then connect to live endpoint)
4. Add alarm-worthiness logic and UI
5. Test on your Android device (using USB, emulator, or QR code)
6. Iterate on UI/UX for mobile
7. (Optional) Add push notification support for alarm-worthy mornings

### TODO / NEXT STEPS (Mobile)
- [ ] Choose and set up mobile app framework (React Native or Flutter)
- [ ] Scaffold project and run "Hello World" on your Android phone
- [ ] Implement data fetching from server (CSV or JSON endpoint)
- [ ] Build UI for wind data visualization and alarm analysis
- [ ] Add dark mode and refresh support
- [ ] Test and iterate on device
- [ ] Plan for push notifications (future)

## TODO / NEXT STEPS
- [x] Add configurable alarm criteria (completed)
- [ ] Set up and test scheduled automation (e.g., cron job) for daily data fetch and visualization
- [ ] Add notification/alarm integration for mobile (push, SMS, or app)
- [ ] Add user-configurable thresholds for alarm-worthiness
- [ ] Integrate weather forecast for multi-day planning (optional)
- [ ] Store historical data for trend analysis over multiple days
- [ ] Continue to review and iterate based on user feedback and real-world use

## Feature Requests from Dawn Patrol group
### Basic
- Alarm that can be snoozed
- Alarm can be sounds or vibration.
- Choose alarm sounds

### Advanced
- Sleep cycle integration to wake you in light sleep once wind is favorable.


