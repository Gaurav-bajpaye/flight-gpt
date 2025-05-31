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
