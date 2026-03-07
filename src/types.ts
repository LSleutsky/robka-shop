export type Status = 'Pending' | 'In Progress' | 'Done' | 'Picked Up';

export interface Repair {
  id: number;
  ticket: string;
  date: string;
  customer: string;
  phone: string | null;
  items: string[];
  specs: string | null;
  status: Status;
  picked_up_at: string | null;
  created_at: string;
}

export interface RepairForm {
  ticket: string;
  date: string;
  customer: string;
  phone: string;
  items: string[];
  specs: string;
  status: Status;
}
