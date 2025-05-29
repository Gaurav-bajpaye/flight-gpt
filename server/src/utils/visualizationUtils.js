function getBookingsByAirline(airlines, flightBookings) {
  const counts = {};
  flightBookings.forEach((booking) => {
    const airlineId = booking.airlie_id;
    const airlineName = getAirlineName(airlines, airlineId);
    counts[airlineName] = (counts[airlineName] || 0) + 1;
  });
  return counts;
}

function getBookingsByStatus(flightBookings) {
  const counts = {};
  flightBookings.forEach((booking) => {
    const status = booking.status;
    counts[status] = (counts[status] || 0) + 1;
  });
  return counts;
}

function getBookingsByClass(flightBookings) {
  const counts = {};
  flightBookings.forEach((booking) => {
    const bookingClass = booking.class;
    counts[bookingClass] = (counts[bookingClass] || 0) + 1;
  });
  return counts;
}

function getAirlineName(airlines, airlineId) {
  const airline = airlines.find((a) => a.airlie_id === airlineId);
  return airline ? airline.airline_name : "Unknown Airline";
}

function generatePieChartExample(airlines, flightBookings) {
  const bookingsByAirline = getBookingsByAirline(airlines, flightBookings);
  const pieData = Object.entries(bookingsByAirline)
    .slice(0, 5)
    .map(([name, value]) => ({ name, y: value }));

  return {
    text: "Here are the top 5 airlines by number of flights:",
    visualization: {
      type: "pie",
      data: pieData,
    },
  };
}

function generateBarChartExample(airlines, flightBookings) {
  const airlineNames = Object.keys(
    getBookingsByAirline(airlines, flightBookings)
  ).slice(0, 5);
  const economyData = [];
  const businessData = [];
  const firstData = [];

  airlineNames.forEach((airline) => {
    const airlineBookings = flightBookings.filter(
      (b) => getAirlineName(airlines, b.airlie_id) === airline
    );
    economyData.push(
      airlineBookings.filter((b) => b.class === "Economy").length
    );
    businessData.push(
      airlineBookings.filter((b) => b.class === "Business").length
    );
    firstData.push(airlineBookings.filter((b) => b.class === "First").length);
  });

  return {
    text: "Here’s a comparison of booking classes across airlines:",
    visualization: {
      type: "bar",
      data: {
        categories: airlineNames,
        series: [
          { name: "Economy", data: economyData },
          { name: "Business", data: businessData },
          { name: "First", data: firstData },
        ],
        xAxisTitle: "Airlines",
        yAxisTitle: "Number of Bookings",
      },
    },
  };
}

function generateLineChartExample(flightBookings) {
  const bookingsByMonth = {};
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  months.forEach((month) => {
    bookingsByMonth[month] = 0;
  });

  flightBookings.forEach((booking) => {
    if (booking.departure_dt) {
      const date = new Date(booking.departure_dt);
      const month = months[date.getMonth()];
      bookingsByMonth[month]++;
    }
  });

  return {
    text: "Here’s the trend of bookings by month:",
    visualization: {
      type: "line",
      data: {
        categories: months,
        series: [
          {
            name: "Bookings",
            data: months.map((month) => bookingsByMonth[month]),
          },
        ],
        xAxisTitle: "Month",
        yAxisTitle: "Number of Bookings",
      },
    },
  };
}

function generateTableExample(airlines, flightBookings) {
  const tableData = flightBookings
    .slice(0, 5)
    .map((booking) => [
      getAirlineName(airlines, booking.airlie_id),
      booking.flght_number,
      booking.status,
      booking.class,
      `$${booking.fare}`,
    ]);

  return {
    text: "Here are some recent booking records:",
    visualization: {
      type: "table",
      data: {
        headers: ["Airline", "Flight", "Status", "Class", "Fare"],
        rows: tableData,
      },
    },
  };
}

module.exports = {
  getBookingsByAirline,
  getBookingsByStatus,
  getBookingsByClass,
  getAirlineName,
  generatePieChartExample,
  generateBarChartExample,
  generateLineChartExample,
  generateTableExample,
};
