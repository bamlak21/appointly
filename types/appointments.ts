export type Appointments = {
  id: string;
  title: string;
  description?: string;
  status: "pending" | "confirmed" | "cancelled";
  phone_number: string;
  date: string;
  start_time: string;
  end_time: string;
  color: string;
};
