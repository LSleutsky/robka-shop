export type Status = 'pending' | 'in progress' | 'done' | 'picked up';

export interface Repair {
  id: number;
  ticket: string;
  date: string;
  customer: string;
  item: string;
  specs: string | null;
  status: Status;
}

export type RepairForm = Omit<Repair, 'id'>;
