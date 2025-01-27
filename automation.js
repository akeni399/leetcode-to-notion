const axios = require('axios');
require('dotenv').config();

const NOTION_API_TOKEN = process.env.NOTION_API_TOKEN;
const DATABASE_ID = process.env.DATABASE_ID;

const NOTION_API_URL_add = "https://api.notion.com/v1/pages";
//const NOTION_API_URL = "https://api.notion.com/v1/pages/c5927a7247c049309ca5a2f17192f5b8"

// Headers for Notion API requests
const HEADERS = {
    "Authorization": `Bearer ${NOTION_API_TOKEN}`,
    "Notion-Version": "2022-06-28"
  };
  
// does the api key work properly with integration to the page
async function checkPageAccess() {
  try {
    const response = await axios.get(NOTION_API_URL, { headers: HEADERS });
    console.log("Access to page confirmed. Page details:", response.data);
  } catch (error) {
    if (error.response) {
      // Error response from the Notion API
      if (error.response.status === 404) {
        console.error("Page not found. Check if the Page ID is correct or if the integration has access to it.");
      } else if (error.response.status === 401) {
        console.error("Unauthorized. Check if the API token is correct or if it has access to the page.");
      } else {
        console.error(`Error accessing page: ${error.response.status} ${error.response.statusText}`);
      }
    } else {
      // Network or other errors
      console.error("Error accessing page:", error.message);
    }
  }
}
  
  // //Execute the test
  // checkPageAccess();


// function to read properties from page
async function getStatusFromPage() {
  try {
    const response = await axios.get(NOTION_API_URL, { headers: HEADERS });
    const pageData = response.data;

    // Adjust the property name based on your database schema
    const status = pageData.properties.language.multi_select[0].name

    console.log("Status of the page:", status);
  } catch (error) {
    if (error.response) {
      // Error response from the Notion API
      if (error.response.status === 404) {
        console.error("Page not found. Check if the Page ID is correct or if the integration has access to it.");
      } else if (error.response.status === 401) {
        console.error("Unauthorized. Check if the API token is correct or if it has access to the page.");
      } else {
        console.error(`Error accessing page: ${error.response.status} ${error.response.statusText}`);
      }
    } else {
      // Network or other errors
      console.error("Error accessing page:", error.message);
    }
  }
}

//getStatusFromPage();

//add problem to the table
async function addLeetcodeProblemToNotion(title) {
  const data = {
    parent: { database_id: DATABASE_ID },
    properties: {
      Name: {
        title: [
          {
            text: {
              content: title
            }
          }
        ]
      }
    }
  };

  try {
    await axios.post(NOTION_API_URL_add, data, { headers: HEADERS });
    console.log(`Successfully added page with title '${title}' to Notion.`);
  } catch (error) {
    console.error(`Failed to add the page to Notion: ${error.response}`);
  }
}

// // Example usage
// (async () => {
//   await addRandomTitleToNotion("hello");
// })();

const username = process.env.LEETCODE_USER
const question = 'missing-number'
const apiUrl = `http://localhost:3000/select?titleSlug=${question}`;

async function getUserDetails() {
  try {
    const response = await axios.get(apiUrl);
    console.log('User Details:', response.data);
  } catch (error) {
    console.error('Error fetching user details:', error.message);
  }
}

// Execute the function
///getUserDetails();


//get last 10 submissions
const problems_url = `http://localhost:3000/${username}/submission?limit=10`;
const title = []
async function getRecentProblems() {
  try {
    const response = await axios.get(problems_url);
    console.log('User Details:', response.data);
    const recentProblems = response.data.submission || [];
    title = recentProblems.map(problem => problem.title);
    console.log(title)
  } catch (error) {
    console.error('Error fetching user details:', error.message);
  }
}

//getRecentProblems();


//check if these problems are already in the database
const search_url = `https://api.notion.com/v1/databases/${DATABASE_ID}/query`;
async function searchProblem() {
  try {
    const response = await axios.post(search_url, {
      filter: {
        property: 'Name',
        title: {
          equals: "hello"
        }
      }
    }, {headers: HEADERS});
    console.log(response.data.results);
  } catch (error) {
    console.error(error.message);
  }
}

searchProblem();


//TODO: if they're not already in the database, add them
