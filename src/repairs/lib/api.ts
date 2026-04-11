import { Repair, RepairForm, Status } from '@/repairs/types';

interface ApiError {
  error: string;
}

interface SessionResponse {
  user: { username: string } | null;
}

type RepairPayload = Omit<RepairForm, 'price'> & { price: number | null };

const request = async <T>(url: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(url, {
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    ...init
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as ApiError | null;

    throw new Error(body?.error ?? `Request failed: ${String(response.status)}`);
  }

  return response.json() as Promise<T>;
};

export const getSession = () => request<SessionResponse>('/api/auth/session');

export const login = (username: string, password: string) =>
  request<{ user: { username: string } }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  });

export const logout = () => request<{ success: true }>('/api/auth/logout', { method: 'POST' });

export const fetchRepairs = () => request<Repair[]>('/api/repairs');

export const createRepair = (payload: RepairPayload) =>
  request<Repair>('/api/repairs', { method: 'POST', body: JSON.stringify(payload) });

export const updateRepair = (id: number, payload: Partial<RepairPayload>) =>
  request<Repair>(`/api/repairs/${String(id)}`, { method: 'PATCH', body: JSON.stringify(payload) });

export const updateRepairStatus = (id: number, status: Status) =>
  request<Repair>(`/api/repairs/${String(id)}`, { method: 'PATCH', body: JSON.stringify({ status }) });

export const deleteRepairs = (ids: number[]) =>
  request<{ success: true }>('/api/repairs', { method: 'DELETE', body: JSON.stringify({ ids }) });
