const axios = require("axios");
const Papa = require("papaparse");
const fs = require("fs").promises;
const path = require("path");
const {
  getBookingsByAirline,
  getBookingsByStatus,
  getBookingsByClass,
  getAirlineName,
  generatePieChartExample,
  generateBarChartExample,
  generateLineChartExample,
  generateTableExample,
} = require("../utils/visualizationUtils");

const GEMINI_API_KEY = "AIzaSyB8iimjnEKmTFVjnSrg-JBBHFY5pzuZSw4";
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-04-17:generateContent";

let airlines = [];
let flightBookings = [];
let isDataLoaded = false;

async function loadData() {
  if (isDataLoaded) return;

  try {
    const [airlinesText, bookingsText] = await Promise.all([
      fs.readFile(
        path.join(__dirname, "../../data", "airlineMapping.csv"),
        "utf-8"
      ),
      fs.readFile(
        path.join(__dirname, "../../data", "flightBookings.csv"),
        "utf-8"
      ),
    ]);

    const airlinesResults = Papa.parse(airlinesText, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
    });

    const bookingsResults = Papa.parse(bookingsText, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
    });

    airlines = airlinesResults.data;
    flightBookings = bookingsResults.data.map((booking) => ({
      ...booking,
      flght_number: booking["flght#"],
    }));

    isDataLoaded = true;
  } catch (error) {
    console.error("Error loading data:", error);
    throw error;
  }
}

async function queryLLM(question) {
  if (!isDataLoaded) {
    await loadData();
  }

  try {
    const airlinesContext = airlines.slice(0, 5);
    const bookingsContext = flightBookings.slice(0, 5);
    const bookingsByAirline = getBookingsByAirline(airlines, flightBookings);
    const bookingsByStatus = getBookingsByStatus(flightBookings);
    const bookingsByClass = getBookingsByClass(flightBookings);
    const pieChartExample = generatePieChartExample(airlines, flightBookings);
    const barChartExample = generateBarChartExample(airlines, flightBookings);
    const lineChartExample = generateLineChartExample(flightBookings);
    const tableExample = generateTableExample(airlines, flightBookings);

    const prompt = `
You are an airline data analyst assistant. Answer the following question about flight data.

Here's a sample of the airline data:
${JSON.stringify(airlinesContext, null, 2)}

Here's a sample of the flight bookings data:
${JSON.stringify(bookingsContext, null, 2)}

The full dataset contains information about ${airlines.length} airlines and ${
      flightBookings.length
    } flight bookings.

Here's an analysis of the data:
- Bookings by airline: ${JSON.stringify(bookingsByAirline)}
- Bookings by status: ${JSON.stringify(bookingsByStatus)}
- Bookings by class: ${JSON.stringify(bookingsByClass)}

IMPORTANT: When responding, ALWAYS include a visualization when appropriate based on the type of query:
1. For distribution questions (like "top airlines", "percentage of flights by class", etc.), use a pie chart
2. For comparison questions (like "compare airlines", "business vs economy bookings"), use a bar chart
3. For trend questions (like "bookings over time", "monthly data"), use a line chart
4. For detailed data requests, use a table

Here are examples of correct response formats:

Example 1 - Pie chart response:
${JSON.stringify(pieChartExample, null, 2)}

Example 2 - Bar chart response:
${JSON.stringify(barChartExample, null, 2)}

Example 3 - Line chart response:
${JSON.stringify(lineChartExample, null, 2)}

Example 4 - Table response:
${JSON.stringify(tableExample, null, 2)}

Now, answer the following question: ${question}

Your response MUST use one of the exact visualization formats shown above, with valid JSON structure.
`;

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 2048 },
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const responseText = response.data.candidates[0].content.parts[0].text;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return { text: responseText };
    } catch (parseError) {
      console.error("Error parsing LLM response:", parseError);
      return { text: responseText };
    }
  } catch (error) {
    console.error("Error querying LLM:", error);
    throw error;
  }
}

module.exports = {
  loadData,
  queryLLM,
  getAirlines: () => airlines,
  getFlightBookings: () => flightBookings,
};
