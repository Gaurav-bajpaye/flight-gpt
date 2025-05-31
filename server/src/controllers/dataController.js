const {
  loadData,
  queryLLM,
  getAirlines,
  getFlightBookings,
} = require("../services/dataService");

const loadDataHandler = async (req, res) => {
  try {
    await loadData();
    res.json({
      message: "Data loaded successfully",
      airlinesCount: getAirlines().length,
      bookingsCount: getFlightBookings().length,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to load data" });
  }
};

const queryLLMHandler = async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: "Question is required" });
  }

  try {
    const response = await queryLLM(question);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Failed to query LLM" });
  }
};

module.exports = {
  loadData: loadDataHandler,
  queryLLM: queryLLMHandler,
};
