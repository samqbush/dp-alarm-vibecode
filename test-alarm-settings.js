// Test script for alarm settings
console.log("Testing wind alarm settings functionality");

// Default settings (same as in the HTML)
const defaultSettings = {
  minAvgSpeed: 10,          // Minimum average wind speed (mph) for alarm worthiness
  minDirConsistency: 70,    // Minimum direction consistency (percentage)
  minDataPoints: 4,         // Minimum data points required
  minConsecutivePoints: 4,  // Minimum consecutive good data points
  minPointSpeed: 8,         // Minimum wind speed for an individual point to be considered "good"
  maxDirDeviation: 40       // Maximum direction deviation (degrees)
};

// Example data with varying conditions
const testData = [
  // Case 1: Should be alarm worthy with default settings
  {
    name: "Good conditions",
    data: [
      { time: "2025-05-17T03:00:00", windSpeed: "11.5", windGust: "14.2", windDirection: "180" },
      { time: "2025-05-17T03:15:00", windSpeed: "12.0", windGust: "14.5", windDirection: "185" },
      { time: "2025-05-17T03:30:00", windSpeed: "11.8", windGust: "13.9", windDirection: "178" },
      { time: "2025-05-17T03:45:00", windSpeed: "12.2", windGust: "15.1", windDirection: "182" },
      { time: "2025-05-17T04:00:00", windSpeed: "11.7", windGust: "14.0", windDirection: "181" },
      { time: "2025-05-17T04:15:00", windSpeed: "11.9", windGust: "14.3", windDirection: "183" },
      { time: "2025-05-17T04:30:00", windSpeed: "12.1", windGust: "14.7", windDirection: "179" },
      { time: "2025-05-17T04:45:00", windSpeed: "12.0", windGust: "14.4", windDirection: "180" }
    ]
  },
  // Case 2: Should not be alarm worthy - speed too low
  {
    name: "Low speed conditions",
    data: [
      { time: "2025-05-17T03:00:00", windSpeed: "7.5", windGust: "9.2", windDirection: "180" },
      { time: "2025-05-17T03:15:00", windSpeed: "7.0", windGust: "9.5", windDirection: "185" },
      { time: "2025-05-17T03:30:00", windSpeed: "7.8", windGust: "9.9", windDirection: "178" },
      { time: "2025-05-17T03:45:00", windSpeed: "7.2", windGust: "10.1", windDirection: "182" },
      { time: "2025-05-17T04:00:00", windSpeed: "7.7", windGust: "10.0", windDirection: "181" },
      { time: "2025-05-17T04:15:00", windSpeed: "7.9", windGust: "10.3", windDirection: "183" },
      { time: "2025-05-17T04:30:00", windSpeed: "8.1", windGust: "10.7", windDirection: "179" },
      { time: "2025-05-17T04:45:00", windSpeed: "8.0", windGust: "10.4", windDirection: "180" }
    ]
  },
  // Case 3: Should not be alarm worthy - direction inconsistent
  {
    name: "Inconsistent direction",
    data: [
      { time: "2025-05-17T03:00:00", windSpeed: "11.5", windGust: "14.2", windDirection: "180" },
      { time: "2025-05-17T03:15:00", windSpeed: "12.0", windGust: "14.5", windDirection: "220" },
      { time: "2025-05-17T03:30:00", windSpeed: "11.8", windGust: "13.9", windDirection: "178" },
      { time: "2025-05-17T03:45:00", windSpeed: "12.2", windGust: "15.1", windDirection: "240" },
      { time: "2025-05-17T04:00:00", windSpeed: "11.7", windGust: "14.0", windDirection: "181" },
      { time: "2025-05-17T04:15:00", windSpeed: "11.9", windGust: "14.3", windDirection: "260" },
      { time: "2025-05-17T04:30:00", windSpeed: "12.1", windGust: "14.7", windDirection: "179" },
      { time: "2025-05-17T04:45:00", windSpeed: "12.0", windGust: "14.4", windDirection: "230" }
    ]
  }
];

// Function to test basic alarm criteria logic
function testAlarmCriteria(data, settings) {
  // Simulate the core of the actual analysis logic
  
  // Calculate average speed
  let totalSpeed = 0;
  let validSpeeds = 0;
  
  data.forEach(point => {
    const speed = parseFloat(point.windSpeed);
    if (!isNaN(speed)) {
      totalSpeed += speed;
      validSpeeds++;
    }
  });
  
  const avgSpeed = validSpeeds > 0 ? totalSpeed / validSpeeds : 0;
  
  // Calculate direction consistency
  const directions = data
    .map(point => parseFloat(point.windDirection))
    .filter(dir => !isNaN(dir));
  
  // Calculate average direction (circular mean)
  let sinSum = 0, cosSum = 0;
  directions.forEach(dir => {
    sinSum += Math.sin(dir * Math.PI / 180);
    cosSum += Math.cos(dir * Math.PI / 180);
  });
  const avgDirection = Math.round((Math.atan2(sinSum, cosSum) * 180 / Math.PI + 360) % 360);
  
  // Calculate consistency as inverse of average deviation
  let totalDeviation = 0;
  directions.forEach(dir => {
    const rawDiff = Math.abs(dir - avgDirection);
    totalDeviation += Math.min(rawDiff, 360 - rawDiff);
  });
  const avgDeviation = directions.length > 0 ? totalDeviation / directions.length : 0;
  const directionConsistency = Math.max(0, 100 - (avgDeviation / 1.8)); // Convert to a 0-100 scale
  
  // Find longest streak of good points
  let currentStreak = 0;
  let maxStreak = 0;
  
  for (const point of data) {
    const speed = parseFloat(point.windSpeed);
    if (!isNaN(speed) && speed >= settings.minPointSpeed) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }
  
  // Determine alarm worthiness based on criteria
  const isSpeedGood = avgSpeed >= settings.minAvgSpeed;
  const isDirectionConsistent = directionConsistency >= settings.minDirConsistency;
  const hasEnoughData = data.length >= settings.minDataPoints;
  const hasConsistentStreak = maxStreak >= settings.minConsecutivePoints;
  
  // Final determination
  let alarmStatus = "NOT WORTHY";
  
  if (!hasEnoughData) {
    alarmStatus = "INSUFFICIENT DATA";
  } else if (isSpeedGood && (isDirectionConsistent || hasConsistentStreak)) {
    alarmStatus = "ALARM WORTHY";
  } else if (isSpeedGood || hasConsistentStreak) {
    alarmStatus = "MARGINAL";
  }
  
  return {
    avgSpeed,
    directionConsistency,
    maxConsecutiveStreak: maxStreak,
    isAlarmWorthy: alarmStatus === "ALARM WORTHY",
    status: alarmStatus,
    metrics: {
      isSpeedGood,
      isDirectionConsistent,
      hasConsistentStreak,
      hasEnoughData
    }
  };
}

// Run tests with default settings
console.log("\nTesting with DEFAULT settings:");
console.log("============================");

testData.forEach(test => {
  const result = testAlarmCriteria(test.data, defaultSettings);
  console.log(`\nTest case: ${test.name}`);
  console.log(`Avg speed: ${result.avgSpeed.toFixed(1)} mph (threshold: ${defaultSettings.minAvgSpeed} mph)`);
  console.log(`Direction consistency: ${result.directionConsistency.toFixed(1)}% (threshold: ${defaultSettings.minDirConsistency}%)`);
  console.log(`Max consecutive streak: ${result.maxConsecutiveStreak} (threshold: ${defaultSettings.minConsecutivePoints})`);
  console.log(`Status: ${result.status}`);
  console.log(`Alarm worthy: ${result.isAlarmWorthy ? "YES" : "NO"}`);
});

// Test with custom settings - lower thresholds
const lowerThresholds = {
  minAvgSpeed: 7,
  minDirConsistency: 50,
  minDataPoints: 3,
  minConsecutivePoints: 3,
  minPointSpeed: 6,
  maxDirDeviation: 60
};

console.log("\nTesting with LOWER thresholds:");
console.log("============================");

testData.forEach(test => {
  const result = testAlarmCriteria(test.data, lowerThresholds);
  console.log(`\nTest case: ${test.name}`);
  console.log(`Avg speed: ${result.avgSpeed.toFixed(1)} mph (threshold: ${lowerThresholds.minAvgSpeed} mph)`);
  console.log(`Direction consistency: ${result.directionConsistency.toFixed(1)}% (threshold: ${lowerThresholds.minDirConsistency}%)`);
  console.log(`Max consecutive streak: ${result.maxConsecutiveStreak} (threshold: ${lowerThresholds.minConsecutivePoints})`);
  console.log(`Status: ${result.status}`);
  console.log(`Alarm worthy: ${result.isAlarmWorthy ? "YES" : "NO"}`);
});

console.log("\nTest complete!");
