export interface User {
  id?: number;
  name: string;
  age?: number;
  gender?: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BowelRecord {
  id?: number;
  userId: number;
  recordTime: string;
  stoolType: number;
  color: string;
  amount: string;
  symptom: string;
  createdAt?: string;
}

export interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

export interface PageParams {
  page: number;
  pageSize: number;
}

export interface PageResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}
