// // import axios from 'axios';
// // import Papa from 'papaparse';
// // import { Airline, FlightBooking, QueryResponse } from '../types';

// // // Gemini API key
// // // const GCP_API_KEY = "AIzaSyB8iimjnEKmTFVjnSrg-JBBHFY5pzuZSw4";
// // const GEMINI_API_KEY = 'AIzaSyB8iimjnEKmTFVjnSrg-JBBHFY5pzuZSw4';
// // const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-04-17:generateContent';

// // class DataService {
// //   private airlines: Airline[] = [];
// //   private flightBookings: FlightBooking[] = [];
// //   private isDataLoaded = false;

// //   // Load data from CSV files
// //   async loadData(): Promise<void> {
// //     if (this.isDataLoaded) return;

// //     try {
// //       const [airlinesResponse, bookingsResponse] = await Promise.all([
// //         fetch('/airlineMapping.csv'),
// //         fetch('/flightBookings.csv')
// //       ]);

// //       const airlinesText = await airlinesResponse.text();
// //       const bookingsText = await bookingsResponse.text();

// //       // Parse airlines data
// //       const airlinesResults = Papa.parse<Airline>(airlinesText, {
// //         header: true,
// //         dynamicTyping: true,
// //         skipEmptyLines: true
// //       });

// //       // Parse flight bookings data
// //       const bookingsResults = Papa.parse<any>(bookingsText, {
// //         header: true,
// //         dynamicTyping: true,
// //         skipEmptyLines: true
// //       });

// //       this.airlines = airlinesResults.data;
// //       this.flightBookings = bookingsResults.data.map((booking: any) => ({
// //         ...booking,
// //         flght_number: booking['flght#'], // Convert flght# to flght_number
// //       }));

// //       this.isDataLoaded = true;
// //     } catch (error) {
// //       console.error('Error loading data:', error);
// //       throw error;
// //     }
// //   }

// //   // Query the LLM with the provided question
// //   async queryLLM(question: string): Promise<QueryResponse> {
// //     if (!this.isDataLoaded) {
// //       await this.loadData();
// //     }

// //     try {
// //       // Prepare context for the LLM with sample data
// //       const airlinesContext = this.airlines.slice(0, 5);
// //       const bookingsContext = this.flightBookings.slice(0, 5);

// //       // Get basic data counts for analysis
// //       const bookingsByAirline = this.getBookingsByAirline();
// //       const bookingsByStatus = this.getBookingsByStatus();
// //       const bookingsByClass = this.getBookingsByClass();

// //       // Generate example visualization data from our actual dataset
// //       const pieChartExample = this.generatePieChartExample();
// //       const barChartExample = this.generateBarChartExample();
// //       const lineChartExample = this.generateLineChartExample();
// //       const tableExample = this.generateTableExample();

// //       // Create a prompt for the LLM
// //       const prompt = `
// // You are an airline data analyst assistant. Answer the following question about flight data.

// // Here's a sample of the airline data:
// // ${JSON.stringify(airlinesContext, null, 2)}

// // Here's a sample of the flight bookings data:
// // ${JSON.stringify(bookingsContext, null, 2)}

// // The full dataset contains information about ${this.airlines.length} airlines and ${this.flightBookings.length} flight bookings.

// // Here's an analysis of the data:
// // - Bookings by airline: ${JSON.stringify(bookingsByAirline)}
// // - Bookings by status: ${JSON.stringify(bookingsByStatus)}
// // - Bookings by class: ${JSON.stringify(bookingsByClass)}

// // IMPORTANT: When responding, ALWAYS include a visualization when appropriate based on the type of query:
// // 1. For distribution questions (like "top airlines", "percentage of flights by class", etc.), use a pie chart
// // 2. For comparison questions (like "compare airlines", "business vs economy bookings"), use a bar chart
// // 3. For trend questions (like "bookings over time", "monthly data"), use a line chart
// // 4. For detailed data requests, use a table

// // Here are examples of correct response formats:

// // Example 1 - Pie chart response:
// // ${JSON.stringify(pieChartExample, null, 2)}

// // Example 2 - Bar chart response:
// // ${JSON.stringify(barChartExample, null, 2)}

// // Example 3 - Line chart response:
// // ${JSON.stringify(lineChartExample, null, 2)}

// // Example 4 - Table response:
// // ${JSON.stringify(tableExample, null, 2)}

// // Now, answer the following question: ${question}

// // Your response MUST use one of the exact visualization formats shown above, with valid JSON structure.
// // `;

// //       const response = await axios.post(
// //         `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
// //         {
// //           contents: [
// //             {
// //               parts: [
// //                 {
// //                   text: prompt
// //                 }
// //               ]
// //             }
// //           ],
// //           generationConfig: {
// //             temperature: 0.2,
// //             maxOutputTokens: 2048
// //           }
// //         },
// //         {
// //           headers: {
// //             'Content-Type': 'application/json'
// //           }
// //         }
// //       );

// //       // Extract the response text
// //       const responseText = response.data.candidates[0].content.parts[0].text;

// //       console.log("LLM Response:", responseText);

// //       // Parse the JSON response from the LLM
// //       try {
// //         // Find the JSON part in the response
// //         const jsonMatch = responseText.match(/\{[\s\S]*\}/);
// //         if (jsonMatch) {
// //           const jsonResponse = JSON.parse(jsonMatch[0]);
// //           return jsonResponse;
// //         } else {
// //           // If no JSON found, return a text-only response
// //           return {
// //             text: responseText
// //           };
// //         }
// //       } catch (parseError) {
// //         // If parsing fails, return the raw text
// //         console.error('Error parsing LLM response:', parseError);
// //         return {
// //           text: responseText
// //         };
// //       }
// //     } catch (error) {
// //       console.error('Error querying LLM:', error);
// //       throw error;
// //     }
// //   }

// //   // Generate pie chart example from real data
// //   generatePieChartExample(): QueryResponse {
// //     const bookingsByAirline = this.getBookingsByAirline();
// //     const pieData = Object.entries(bookingsByAirline)
// //       .slice(0, 5)
// //       .map(([name, value]) => ({ name, y: value }));

// //     return {
// //       text: "Here are the top 5 airlines by number of flights:",
// //       visualization: {
// //         type: "pie",
// //         data: pieData
// //       }
// //     };
// //   }

// //   // Generate bar chart example from real data
// //   generateBarChartExample(): QueryResponse {
// //     const bookingsByClass = this.getBookingsByClass();
// //     const airlineNames = Object.keys(this.getBookingsByAirline()).slice(0, 5);

// //     // Get counts of economy, business, and first class for each airline
// //     const economyData: number[] = [];
// //     const businessData: number[] = [];
// //     const firstData: number[] = [];

// //     airlineNames.forEach(airline => {
// //       const airlineBookings = this.flightBookings.filter(b =>
// //         this.getAirlineName(b.airlie_id) === airline);

// //       economyData.push(airlineBookings.filter(b => b.class === 'Economy').length);
// //       businessData.push(airlineBookings.filter(b => b.class === 'Business').length);
// //       firstData.push(airlineBookings.filter(b => b.class === 'First').length);
// //     });

// //     return {
// //       text: "Here's a comparison of booking classes across airlines:",
// //       visualization: {
// //         type: "bar",
// //         data: {
// //           categories: airlineNames,
// //           series: [
// //             { name: "Economy", data: economyData },
// //             { name: "Business", data: businessData },
// //             { name: "First", data: firstData }
// //           ],
// //           xAxisTitle: "Airlines",
// //           yAxisTitle: "Number of Bookings"
// //         }
// //       }
// //     };
// //   }

// //   // Generate line chart example from real data
// //   generateLineChartExample(): QueryResponse {
// //     // Extract months from booking dates
// //     const bookingsByMonth: Record<string, number> = {};
// //     const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// //     months.forEach(month => {
// //       bookingsByMonth[month] = 0;
// //     });

// //     this.flightBookings.forEach(booking => {
// //       if (booking.departure_dt) {
// //         const date = new Date(booking.departure_dt);
// //         const month = months[date.getMonth()];
// //         bookingsByMonth[month]++;
// //       }
// //     });

// //     return {
// //       text: "Here's the trend of bookings by month:",
// //       visualization: {
// //         type: "line",
// //         data: {
// //           categories: months,
// //           series: [
// //             {
// //               name: "Bookings",
// //               data: months.map(month => bookingsByMonth[month])
// //             }
// //           ],
// //           xAxisTitle: "Month",
// //           yAxisTitle: "Number of Bookings"
// //         }
// //       }
// //     };
// //   }

// //   // Generate table example from real data
// //   generateTableExample(): QueryResponse {
// //     const tableData = this.flightBookings.slice(0, 5).map(booking => [
// //       this.getAirlineName(booking.airlie_id),
// //       booking.flght_number,
// //       booking.status,
// //       booking.class,
// //       `$${booking.fare}`
// //     ]);

// //     return {
// //       text: "Here are some recent booking records:",
// //       visualization: {
// //         type: "table",
// //         data: {
// //           headers: ["Airline", "Flight", "Status", "Class", "Fare"],
// //           rows: tableData
// //         }
// //       }
// //     };
// //   }

// //   // Get count of bookings by airline
// //   getBookingsByAirline(): Record<string, number> {
// //     const counts: Record<string, number> = {};

// //     this.flightBookings.forEach(booking => {
// //       const airlineId = booking.airlie_id;
// //       const airlineName = this.getAirlineName(airlineId);

// //       if (!counts[airlineName]) {
// //         counts[airlineName] = 0;
// //       }

// //       counts[airlineName]++;
// //     });

// //     return counts;
// //   }

// //   // Get count of bookings by status
// //   getBookingsByStatus(): Record<string, number> {
// //     const counts: Record<string, number> = {};

// //     this.flightBookings.forEach(booking => {
// //       const status = booking.status;

// //       if (!counts[status]) {
// //         counts[status] = 0;
// //       }

// //       counts[status]++;
// //     });

// //     return counts;
// //   }

// //   // Get count of bookings by class
// //   getBookingsByClass(): Record<string, number> {
// //     const counts: Record<string, number> = {};

// //     this.flightBookings.forEach(booking => {
// //       const bookingClass = booking.class;

// //       if (!counts[bookingClass]) {
// //         counts[bookingClass] = 0;
// //       }

// //       counts[bookingClass]++;
// //     });

// //     return counts;
// //   }

// //   // Perform data analysis on the loaded data
// //   analyzeData(query: string): any {
// //     // This function would normally perform the actual data analysis
// //     // based on the query, but in this case we'll rely on the LLM
// //     return this.queryLLM(query);
// //   }

// //   // Get airline name by ID
// //   getAirlineName(airlineId: number): string {
// //     const airline = this.airlines.find(a => a.airlie_id === airlineId);
// //     return airline ? airline.airline_name : 'Unknown Airline';
// //   }
// // }

// // // Create and export a singleton instance
// // export const dataService = new DataService();

// // client/src/services/DataService.ts
// import axios from "axios";
// import { Airline, FlightBooking, QueryResponse } from "../types";

// class DataService {
//   private isDataLoaded = false;

//   // Load data by calling the backend
//   async loadData(): Promise<void> {
//     if (this.isDataLoaded) return;

//     try {
//       const response = await axios.get("http://localhost:3001/api/load-data");
//       console.log(response.data.message);
//       this.isDataLoaded = true;
//     } catch (error) {
//       console.error("Error loading data:", error);
//       throw error;
//     }
//   }

//   // Query the LLM via the backend
//   async queryLLM(question: string): Promise<QueryResponse> {
//     if (!this.isDataLoaded) {
//       await this.loadData();
//     }

//     try {
//       const response = await axios.post("http://localhost:3001/api/query", {
//         question,
//       });
//       return response.data;
//     } catch (error) {
//       console.error("Error querying LLM:", error);
//       throw error;
//     }
//   }

//   // Analyze data by calling the backend
//   analyzeData(query: string): Promise<QueryResponse> {
//     return this.queryLLM(query);
//   }
// }

// // Create and export a singleton instance
// export const dataService = new DataService();

// client/src/services/DataService.ts
import axios from "axios";
import { QueryResponse } from "../types";

class DataService {
  private isDataLoaded = false;

  // Load data by calling the backend
  async loadData(): Promise<void> {
    if (this.isDataLoaded) return;

    try {
      const response = await axios.get("http://localhost:3001/api/load-data");
      console.log(response.data.message);
      this.isDataLoaded = true;
    } catch (error) {
      console.error("Error loading data:", error);
      throw error;
    }
  }

  // Query the LLM via the backend
  async queryLLM(question: string): Promise<QueryResponse> {
    if (!this.isDataLoaded) {
      await this.loadData();
    }

    try {
      const response = await axios.post("http://localhost:3001/api/query", {
        question,
      });
      return response.data;
    } catch (error) {
      console.error("Error querying LLM:", error);
      throw error;
    }
  }

  // Analyze data by calling the backend
  analyzeData(query: string): Promise<QueryResponse> {
    return this.queryLLM(query);
  }
}

// Create and export a singleton instance
export const dataService = new DataService();
