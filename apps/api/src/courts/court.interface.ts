export interface Court {
  id: string;
  name: string;
  location?: string;
  status: 'available' | 'occupied' | 'maintenance';
  type: 'indoor' | 'outdoor';
  capacity?: number;
  createdAt: Date;
  updatedAt: Date;
}
