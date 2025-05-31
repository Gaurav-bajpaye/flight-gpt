# Flight Data Analyzer

A React application for analyzing flight booking data using the Gemini AI API.

## Features

- Interactive chat interface for querying flight data
- Dynamic data visualizations based on query type (pie charts, bar charts, line charts, tables)
- Real-time response handling with custom polling state management
- Material UI components for a modern user interface

## How It Works

The application loads flight booking data from CSV files located in the public folder:
- `airlineMapping.csv`: Maps airline IDs to airline names
- `flightBookings.csv`: Contains detailed flight booking information

Users can ask questions about the data through the chat interface. The application then:

1. Sends the query to the Gemini API with context about the flight data
2. Processes the response to extract text and visualization information
3. Renders appropriate visualizations based on the query type

## Example Queries

Try asking questions like:
- "Which airline has the most flights listed?"
- "What are the top three most frequented destinations?"
- "Show me the average flight delay per airline"
- "Display the number of bookings per month"
- "Compare business vs economy class bookings"

## Technical Implementation

- **React**: Frontend framework
- **TypeScript**: Type safety
- **Material UI**: Component library
- **Highcharts**: Data visualization
- **Gemini API**: AI language model for query processing
- **Custom Hooks**: usePollingState for asynchronous response handling
