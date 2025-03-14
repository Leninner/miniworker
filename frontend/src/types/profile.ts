export interface User {
  name: string;
  role: string;
  avatar: string;
  isOnline: boolean;
}

export interface FileData {
  id: number;
  name: string;
  type: string;
  date: string;
  size: string;
}

export interface LinkData {
  id: number;
  url: string;
  date: string;
  time: string;
} 