// // server/index.js
// const express = require("express");
// const axios = require("axios");
// const Papa = require("papaparse");
// const fs = require("fs").promises;
// const path = require("path");
// const cors = require("cors");

// const app = express();
// const port = 3001;

// app.use(cors());
// app.use(express.json());

// const GEMINI_API_KEY = "AIzaSyB8iimjnEKmTFVjnSrg-JBBHFY5pzuZSw4";
// const GEMINI_API_URL =
//   "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-04-17:generateContent";

// let airlines = [];
// let flightBookings = [];
// let isDataLoaded = false;

// // Load data from CSV files
// async function loadData() {
//   if (isDataLoaded) return;

//   try {
//     const [airlinesText, bookingsText] = await Promise.all([
//       fs.readFile(path.join(__dirname, "data", "airlineMapping.csv"), "utf-8"),
//       fs.readFile(path.join(__dirname, "data", "flightBookings.csv"), "utf-8"),
//     ]);

//     // Parse airlines data
//     const airlinesResults = Papa.parse(airlinesText, {
//       header: true,
//       dynamicTyping: true,
//       skipEmptyLines: true,
//     });

//     // Parse flight bookings data
//     const bookingsResults = Papa.parse(bookingsText, {
//       header: true,
//       dynamicTyping: true,
//       skipEmptyLines: true,
//     });

//     airlines = airlinesResults.data;
//     flightBookings = bookingsResults.data.map((booking) => ({
//       ...booking,
//       flght_number: booking["flght#"],
//     }));

//     isDataLoaded = true;
//   } catch (error) {
//     console.error("Error loading data:", error);
//     throw error;
//   }
// }

// // Helper functions
// function getBookingsByAirline() {
//   const counts = {};
//   flightBookings.forEach((booking) => {
//     const airlineId = booking.airlie_id;
//     const airlineName = getAirlineName(airlineId);
//     counts[airlineName] = (counts[airlineName] || 0) + 1;
//   });
//   return counts;
// }

// function getBookingsByStatus() {
//   const counts = {};
//   flightBookings.forEach((booking) => {
//     const status = booking.status;
//     counts[status] = (counts[status] || 0) + 1;
//   });
//   return counts;
// }

// function getBookingsByClass() {
//   const counts = {};
//   flightBookings.forEach((booking) => {
//     const bookingClass = booking.class;
//     counts[bookingClass] = (counts[bookingClass] || 0) + 1;
//   });
//   return counts;
// }

// function getAirlineName(airlineId) {
//   const airline = airlines.find((a) => a.airlie_id === airlineId);
//   return airline ? airline.airline_name : "Unknown Airline";
// }

// function generatePieChartExample() {
//   const bookingsByAirline = getBookingsByAirline();
//   const pieData = Object.entries(bookingsByAirline)
//     .slice(0, 5)
//     .map(([name, value]) => ({ name, y: value }));

//   return {
//     text: "Here are the top 5 airlines by number of flights:",
//     visualization: {
//       type: "pie",
//       data: pieData,
//     },
//   };
// }

// function generateBarChartExample() {
//   const bookingsByClass = getBookingsByClass();
//   const airlineNames = Object.keys(getBookingsByAirline()).slice(0, 5);

//   const economyData = [];
//   const businessData = [];
//   const firstData = [];

//   airlineNames.forEach((airline) => {
//     const airlineBookings = flightBookings.filter(
//       (b) => getAirlineName(b.airlie_id) === airline
//     );
//     economyData.push(
//       airlineBookings.filter((b) => b.class === "Economy").length
//     );
//     businessData.push(
//       airlineBookings.filter((b) => b.class === "Business").length
//     );
//     firstData.push(airlineBookings.filter((b) => b.class === "First").length);
//   });

//   return {
//     text: "Here’s a comparison of booking classes across airlines:",
//     visualization: {
//       type: "bar",
//       data: {
//         categories: airlineNames,
//         series: [
//           { name: "Economy", data: economyData },
//           { name: "Business", data: businessData },
//           { name: "First", data: firstData },
//         ],
//         xAxisTitle: "Airlines",
//         yAxisTitle: "Number of Bookings",
//       },
//     },
//   };
// }

// function generateLineChartExample() {
//   const bookingsByMonth = {};
//   const months = [
//     "Jan",
//     "Feb",
//     "Mar",
//     "Apr",
//     "May",
//     "Jun",
//     "Jul",
//     "Aug",
//     "Sep",
//     "Oct",
//     "Nov",
//     "Dec",
//   ];

//   months.forEach((month) => {
//     bookingsByMonth[month] = 0;
//   });

//   flightBookings.forEach((booking) => {
//     if (booking.departure_dt) {
//       const date = new Date(booking.departure_dt);
//       const month = months[date.getMonth()];
//       bookingsByMonth[month]++;
//     }
//   });

//   return {
//     text: "Here’s the trend of bookings by month:",
//     visualization: {
//       type: "line",
//       data: {
//         categories: months,
//         series: [
//           {
//             name: "Bookings",
//             data: months.map((month) => bookingsByMonth[month]),
//           },
//         ],
//         xAxisTitle: "Month",
//         yAxisTitle: "Number of Bookings",
//       },
//     },
//   };
// }

// function generateTableExample() {
//   const tableData = flightBookings
//     .slice(0, 5)
//     .map((booking) => [
//       getAirlineName(booking.airlie_id),
//       booking.flght_number,
//       booking.status,
//       booking.class,
//       `$${booking.fare}`,
//     ]);

//   return {
//     text: "Here are some recent booking records:",
//     visualization: {
//       type: "table",
//       data: {
//         headers: ["Airline", "Flight", "Status", "Class", "Fare"],
//         rows: tableData,
//       },
//     },
//   };
// }

// // API Endpoints
// app.get("/api/load-data", async (req, res) => {
//   try {
//     await loadData();
//     res.json({
//       message: "Data loaded successfully",
//       airlinesCount: airlines.length,
//       bookingsCount: flightBookings.length,
//     });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to load data" });
//   }
// });

// app.post("/api/query", async (req, res) => {
//   const { question } = req.body;

//   if (!question) {
//     return res.status(400).json({ error: "Question is required" });
//   }

//   try {
//     if (!isDataLoaded) {
//       await loadData();
//     }

//     const airlinesContext = airlines.slice(0, 5);
//     const bookingsContext = flightBookings.slice(0, 5);
//     const bookingsByAirline = getBookingsByAirline();
//     const bookingsByStatus = getBookingsByStatus();
//     const bookingsByClass = getBookingsByClass();
//     const pieChartExample = generatePieChartExample();
//     const barChartExample = generateBarChartExample();
//     const lineChartExample = generateLineChartExample();
//     const tableExample = generateTableExample();

//     const prompt = `
// You are an airline data analyst assistant. Answer the following question about flight data.

// Here's a sample of the airline data:
// ${JSON.stringify(airlinesContext, null, 2)}

// Here's a sample of the flight bookings data:
// ${JSON.stringify(bookingsContext, null, 2)}

// The full dataset contains information about ${airlines.length} airlines and ${
//       flightBookings.length
//     } flight bookings.

// Here's an analysis of the data:
// - Bookings by airline: ${JSON.stringify(bookingsByAirline)}
// - Bookings by status: ${JSON.stringify(bookingsByStatus)}
// - Bookings by class: ${JSON.stringify(bookingsByClass)}

// IMPORTANT: When responding, ALWAYS include a visualization when appropriate based on the type of query:
// 1. For distribution questions (like "top airlines", "percentage of flights by class", etc.), use a pie chart
// 2. For comparison questions (like "compare airlines", "business vs economy bookings"), use a bar chart
// 3. For trend questions (like "bookings over time", "monthly data"), use a line chart
// 4. For detailed data requests, use a table

// Here are examples of correct response formats:

// Example 1 - Pie chart response:
// ${JSON.stringify(pieChartExample, null, 2)}

// Example 2 - Bar chart response:
// ${JSON.stringify(barChartExample, null, 2)}

// Example 3 - Line chart response:
// ${JSON.stringify(lineChartExample, null, 2)}

// Example 4 - Table response:
// ${JSON.stringify(tableExample, null, 2)}

// Now, answer the following question: ${question}

// Your response MUST use one of the exact visualization formats shown above, with valid JSON structure.
// `;

//     const response = await axios.post(
//       `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
//       {
//         contents: [
//           {
//             parts: [
//               {
//                 text: prompt,
//               },
//             ],
//           },
//         ],
//         generationConfig: {
//           temperature: 0.2,
//           maxOutputTokens: 2048,
//         },
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const responseText = response.data.candidates[0].content.parts[0].text;
//     try {
//       const jsonMatch = responseText.match(/\{[\s\S]*\}/);
//       if (jsonMatch) {
//         const jsonResponse = JSON.parse(jsonMatch[0]);
//         res.json(jsonResponse);
//       } else {
//         res.json({ text: responseText });
//       }
//     } catch (parseError) {
//       console.error("Error parsing LLM response:", parseError);
//       res.json({ text: responseText });
//     }
//   } catch (error) {
//     console.error("Error querying LLM:", error);
//     res.status(500).json({ error: "Failed to query LLM" });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });

// server/src/index.js
const express = require("express");
const cors = require("cors");
const dataController = require("./controllers/dataController");

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// API Routes
app.get("/api/load-data", dataController.loadData);
app.post("/api/query", dataController.queryLLM);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
