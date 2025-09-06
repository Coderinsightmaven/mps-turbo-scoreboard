import { Injectable } from '@nestjs/common';
import { Court } from './court.interface';

@Injectable()
export class CourtsService {
  private courts: Court[] = [
    {
      id: '1',
      name: 'Court A',
      location: 'Main Building',
      status: 'available',
      type: 'indoor',
      capacity: 4,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      name: 'Court B',
      location: 'Main Building',
      status: 'occupied',
      type: 'indoor',
      capacity: 4,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: '3',
      name: 'Outdoor Court 1',
      location: 'Backyard',
      status: 'available',
      type: 'outdoor',
      capacity: 2,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
  ];

  findAll(): Court[] {
    return this.courts;
  }

  findOne(id: string): Court | undefined {
    return this.courts.find(court => court.id === id);
  }

  findByStatus(status: string): Court[] {
    return this.courts.filter(court => court.status === status);
  }

  findByType(type: string): Court[] {
    return this.courts.filter(court => court.type === type);
  }

  create(courtData: Omit<Court, 'id' | 'createdAt' | 'updatedAt'>): Court {
    const newCourt: Court = {
      ...courtData,
      id: (this.courts.length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.courts.push(newCourt);
    return newCourt;
  }

  delete(id: string): boolean {
    const index = this.courts.findIndex(court => court.id === id);
    if (index !== -1) {
      this.courts.splice(index, 1);
      return true;
    }
    return false;
  }
}
