export interface Airline {
  airlie_id: number;
  airline_name: string;
}

export interface FlightBooking {
  airlie_id: number;
  flght_number: string;
  departure_dt: string;
  arrival_dt: string;
  dep_time: string;
  arrivl_time: string;
  booking_cd: string;
  passngr_nm: string;
  seat_no: string;
  class: string;
  fare: number;
  extras: string;
  loyalty_pts: number;
  status: string;
  gate: string;
  terminal: string;
  baggage_claim: string;
  duration_hrs: number;
  layovers: number;
  layover_locations: string;
  aircraft_type: string;
  pilot: string;
  cabin_crew: string;
  inflight_ent: string;
  meal_option: string;
  wifi: string;
  window_seat: boolean;
  aisle_seat: boolean;
  emergency_exit_row: boolean;
  number_of_stops: number;
  reward_program_member: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface QueryResponse {
  text: string;
  visualization?: {
    type: 'pie' | 'bar' | 'line' | 'table';
    data: any;
  };
}

export interface PollingState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  isPending: boolean;
} 