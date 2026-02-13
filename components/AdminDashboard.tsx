import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface Booking {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  notes: string;
  paymentMethod: string;
  soapChoice: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'in-transit' | 'completed' | 'cancelled' | 'received';
  createdAt: string;
  deliveryOption?: boolean;
  deliveryDistance?: number;
  deliveryFee?: number;
  totalAmount?: number;
  statusLog?: Array<{
    status: string;
    timestamp: string;
    changedBy: 'admin' | 'customer' | 'system';
  }>;
}

interface AdminDashboardProps {
  bookings: Booking[];
  onUpdateStatus: (id: string, status: Booking['status']) => void;
  onDeleteBooking: (id: string) => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  bookings,
  onUpdateStatus,
  onDeleteBooking,
  onLogout
}) => {
  const [filter, setFilter] = useState<string>('all');

  const getTodaysDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const isBusinessOpen = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours * 60 + minutes; // Convert to minutes
    const openTime = 8 * 60; // 8:00 AM
    const closeTime = 18 * 60; // 6:00 PM
    return currentTime >= openTime && currentTime < closeTime;
  };

  const getDailyProfit = () => {
    const today = getTodaysDate();
    return bookings
      .filter(b => {
        const bookingDate = b.createdAt.split('T')[0];
        return bookingDate === today && b.status === 'completed';
      })
      .reduce((total, b) => total + (b.totalAmount || 0), 0);
  };

  const filteredBookings = filter === 'all'
    ? bookings
    : bookings.filter(booking => booking.status === filter);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-purple-100 text-purple-800',
      'in-transit': 'bg-indigo-100 text-indigo-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      received: 'bg-teal-100 text-teal-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    inProgress: bookings.filter(b => b.status === 'in-progress').length,
    completed: bookings.filter(b => b.status === 'completed').length,
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-normal text-black">Admin Dashboard</h1>
            <button onClick={onLogout} className="text-black hover:text-gray-600 transition-colors">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="border border-gray-200 p-6">
            <div className="text-sm text-gray-600 mb-2">Total Bookings</div>
            <div className="text-2xl font-normal text-black">{stats.total}</div>
          </div>
          <div className="border border-gray-200 p-6">
            <div className="text-sm text-gray-600 mb-2">Pending</div>
            <div className="text-2xl font-normal text-black">{stats.pending}</div>
          </div>
          <div className="border border-gray-200 p-6">
            <div className="text-sm text-gray-600 mb-2">In Progress</div>
            <div className="text-2xl font-normal text-black">{stats.inProgress}</div>
          </div>
          <div className="border border-gray-200 p-6">
            <div className="text-sm text-gray-600 mb-2">Completed</div>
            <div className="text-2xl font-normal text-black">{stats.completed}</div>
          </div>
        </div>

        <div className="border border-gray-200 p-6 mb-8 bg-blue-50">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-600 mb-2">Today's Profit {isBusinessOpen() ? '(Active)' : '(Closed)'}</div>
              <div className="text-3xl font-bold text-blue-600">₱{getDailyProfit().toFixed(2)}</div>
              <div className="text-xs text-gray-500 mt-2">Business Hours: 8:00 AM - 6:00 PM</div>
              <div className="text-xs text-gray-500">Completed bookings only</div>
            </div>
            <div className={`px-4 py-2 rounded font-medium ${isBusinessOpen() ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
              {isBusinessOpen() ? '🟢 Open' : '🔴 Closed'}
            </div>
          </div>
        </div>

        <div className="border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-normal text-black">Bookings</h2>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-48 !bg-white !border !border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="!bg-white">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="in-transit">In Transit</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="received">Received</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Date/Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{booking.firstName} {booking.lastName}</div>
                        <div className="text-sm text-gray-500">{booking.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{booking.service}</TableCell>
                    <TableCell>
                      <div>{booking.date}</div>
                      <div className="text-sm text-gray-500">{booking.time}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell>₱{(booking.totalAmount || 0).toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Select
                          value={booking.status}
                          onValueChange={(value) => onUpdateStatus(booking.id, value as Booking['status'])}
                        >
                          <SelectTrigger className="w-32 !bg-white !border !border-gray-300">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="!bg-white">
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="in-transit">In Transit</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                            <SelectItem value="received">Received</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onDeleteBooking(booking.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
};