// This script fetches Pokemon TCG sets data and saves it as static JSON files
import fetch from 'node-fetch';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize environment variables and API URL
function initializeEnv() {
  dotenv.config({ path: '.env.development' });
  const apiBaseUrl = process.env.API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error('API_BASE_URL is not defined in .env.development');
  }
  return apiBaseUrl;
}

async function fetchWithAuth(url) {
  // Note: During build time we use a special build token, 
  // this should be set in your CI/CD environment
  const token = process.env.BUILD_TOKEN;
  
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  return response.json();
}

async function fetchAllData(apiBaseUrl) {
  try {
    // First fetch all series
    const series = await fetchWithAuth(`${apiBaseUrl}/sets/series`);
    
    // Then fetch sets for each series
    const setsData = {};
    for (const seriesName of series) {
      const sets = await fetchWithAuth(`${apiBaseUrl}/sets/by-series?series=${seriesName}`);
      setsData[seriesName] = sets;
    }

    // Create the data directory if it doesn't exist
    await fs.mkdir(path.join(__dirname, '../src/data'), { recursive: true });

    // Save the data
    await fs.writeFile(
      path.join(__dirname, '../src/data/sets.json'),
      JSON.stringify({ series, setsBySeries: setsData }, null, 2)
    );

    console.log('✅ Successfully fetched and saved sets data');
  } catch (error) {
    console.error('❌ Error fetching sets data:', error);
    console.error(error);
    throw error;
  }
}

// Main execution
async function main() {
  try {
    const apiBaseUrl = initializeEnv();
    await fetchAllData(apiBaseUrl);
  } catch (error) {
    console.error('Failed to execute script:', error);
    process.exit(1);
  }
}

main();
