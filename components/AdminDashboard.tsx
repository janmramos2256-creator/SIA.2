import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

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

interface Service {
  id: string;
  title: string;
  price: number;
  priceUnit: string;
  description: string;
  features: string[];
  status: 'active' | 'inactive';
}

interface SoapPrices {
  soap: number;
  pabcon: number;
  both: number;
}

interface Discount {
  id: string;
  name: string;
  description: string;
  active: boolean;
  value?: number; // For percentage discounts
  type: 'percentage' | 'free_deliveries' | 'fixed_amount' | 'free_shipping';
  freeDeliveries?: number; // For free deliveries discount
  code?: string; // Coupon code
  usageLimitPerCustomer?: number;
  eligibility?: 'new_accounts' | 'all';
  expiryDaysAfterCreation?: number;
  minimumOrder?: number;
}

interface AdminDashboardProps {
  bookings: Booking[];
  services: Service[];
  discounts: Discount[];
  soapPrices: SoapPrices;
  onUpdateStatus: (id: string, status: Booking['status']) => void;
  onDeleteBooking: (id: string) => void;
  onUpdateServices: (services: Service[]) => void;
  onUpdateDiscounts: (discounts: Discount[]) => void;
  onUpdateSoapPrices: (prices: SoapPrices) => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  bookings,
  services,
  discounts,
  soapPrices,
  onUpdateStatus,
  onDeleteBooking,
  onUpdateServices,
  onUpdateDiscounts,
  onUpdateSoapPrices,
  onLogout
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [discountsState, setDiscountsState] = useState<Discount[]>(discounts);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [soapPricesInput, setSoapPricesInput] = useState<SoapPrices>(soapPrices);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);

  React.useEffect(() => {
    setSoapPricesInput(soapPrices);
  }, [soapPrices]);

  React.useEffect(() => {
    setDiscountsState(discounts);
  }, [discounts]);

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

  const getServiceTitle = (serviceId: string) => {
    const service = services.find((s) => s.id === serviceId);
    return service ? service.title : serviceId;
  };

  const getSoapLabel = (soapChoice: string) => {
    if (soapChoice === 'bring-own') return 'Bring own soap/pabcon';
    if (soapChoice === 'soap') return 'Soap';
    if (soapChoice === 'pabcon') return 'Pabcon';
    if (soapChoice === 'both') return 'Soap & Pabcon';
    return 'Not specified';
  };

  const getPaymentLabel = (method: string) => {
    switch (method) {
      case 'cash':
        return 'Cash';
      case 'g-cash':
      case 'gcash':
        return 'G-Cash';
      case 'maya':
        return 'Maya';
      case 'credit-card':
      case 'card':
        return 'Credit Card';
      default:
        return method || 'Not specified';
    }
  };

  const filteredBookings = bookings
    .filter((booking) => (filter === 'all' ? true : booking.status === filter))
    .filter((booking) => {
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      const fullName = `${booking.firstName} ${booking.lastName}`.toLowerCase();
      const address = `${booking.street} ${booking.city} ${booking.state} ${booking.zip}`.toLowerCase();
      return (
        fullName.includes(term) ||
        booking.email.toLowerCase().includes(term) ||
        booking.phone.toLowerCase().includes(term) ||
        address.includes(term) ||
        booking.service.toLowerCase().includes(term)
      );
    });

  const getStatusColor = (status: Booking['status']) => {
    const colors: Record<Booking['status'], string> = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-purple-100 text-purple-800',
      'in-transit': 'bg-orange-100 text-orange-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'received': 'bg-teal-100 text-teal-800'
    };
    return colors[status];
  };

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    inProgress: bookings.filter(b => b.status === 'in-progress').length,
    completed: bookings.filter(b => b.status === 'completed').length,
  };

  const handleSaveDiscounts = () => {
    onUpdateDiscounts(discountsState);
  };

  const handleToggleDiscount = (id: string) => {
    setDiscountsState(discountsState.map(discount =>
      discount.id === id ? { ...discount, active: !discount.active } : discount
    ));
  };

  const handleUpdateDiscountValue = (id: string, value: number) => {
    setDiscountsState(discountsState.map(discount =>
      discount.id === id ? { ...discount, value } : discount
    ));
  };

  const handleUpdateFreeDeliveries = (id: string, freeDeliveries: number) => {
    setDiscountsState(discountsState.map(discount =>
      discount.id === id ? { ...discount, freeDeliveries } : discount
    ));
  };

  const handleEditDiscount = (discount: Discount) => {
    setEditingDiscount({ ...discount });
  };

  const handleCancelEditDiscount = () => {
    setEditingDiscount(null);
  };

  const handleSaveEditDiscount = () => {
    if (editingDiscount) {
      setDiscountsState(discountsState.map(discount =>
        discount.id === editingDiscount.id ? editingDiscount : discount
      ));
      setEditingDiscount(null);
    }
  };

  const handleUpdateEditingDiscount = (field: keyof Discount, value: any) => {
    if (editingDiscount) {
      setEditingDiscount({ ...editingDiscount, [field]: value });
    }
  };

  const handleSoapPriceChange = (type: keyof SoapPrices, value: number) => {
    setSoapPricesInput({ ...soapPricesInput, [type]: value });
  };

  const handleSaveSoapPrices = () => {
    onUpdateSoapPrices(soapPricesInput);
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
        <div className="mb-6">
          <nav className="flex space-x-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'bookings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Bookings
            </button>
            <button
              onClick={() => setActiveTab('pricing')}
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'pricing'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Pricing
            </button>
            <button
              onClick={() => setActiveTab('discount')}
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'discount'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Discount
            </button>
          </nav>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="border border-gray-200 p-6 bg-blue-50">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">Today's Profit</div>
                <div className="text-3xl font-bold text-blue-600">₱{getDailyProfit().toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-2">Business Hours: 8:00 AM - 6:00 PM</div>
                <div className="text-xs text-gray-500">Completed bookings only</div>
              </div>
            </div>

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

            <div className="border-4 border-blue-300 p-8 bg-yellow-50 shadow-lg rounded-lg">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Business Status</h2>
              </div>
              <div className="flex justify-center">
                <div className={`px-10 py-6 rounded-xl font-bold text-2xl border-4 shadow-md ${isBusinessOpen() ? 'bg-green-200 text-green-900 border-green-400' : 'bg-red-200 text-red-900 border-red-400'}`}>
                  {isBusinessOpen() ? '🟢 BUSINESS IS OPEN' : '🔴 BUSINESS IS CLOSED'}
                </div>
              </div>
              <div className="text-center mt-4 text-sm text-gray-600">
                Operating Hours: 8:00 AM - 6:00 PM
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Price Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Service Prices</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {services.map((service) => (
                      <div key={service.id} className="border border-gray-200 p-4">
                        <h4 className="font-medium mb-2">{service.title}</h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">₱</span>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={service.price}
                            onChange={(e) => {
                              const updatedServices = services.map(s =>
                                s.id === service.id ? { ...s, price: parseFloat(e.target.value) || 0 } : s
                              );
                              onUpdateServices(updatedServices);
                            }}
                            className="w-20"
                          />
                          <span className="text-sm text-gray-600">{service.priceUnit}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Soap Choice Prices</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Soap (₱)</label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={soapPricesInput.soap}
                        onChange={(e) => handleSoapPriceChange('soap', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Pabcon (₱)</label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={soapPricesInput.pabcon}
                        onChange={(e) => handleSoapPriceChange('pabcon', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Both (₱)</label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={soapPricesInput.both}
                        onChange={(e) => handleSoapPriceChange('both', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  <Button onClick={handleSaveSoapPrices} className="mt-4">Save Soap Prices</Button>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Discount Management</h3>
                  <div className="space-y-4">
                    {discountsState.map((discount) => (
                      <div key={discount.id} className="border border-gray-200 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={discount.active}
                              onChange={() => handleToggleDiscount(discount.id)}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <div>
                              <h4 className="font-medium">{discount.name}</h4>
                              <p className="text-sm text-gray-600">{discount.description}</p>
                            </div>
                          </div>
                          <Badge className={discount.active ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}>
                            {discount.active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>

                        {discount.type === 'percentage' && discount.value !== undefined && (
                          <div className="flex items-center space-x-2">
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={discount.value}
                              onChange={(e) => handleUpdateDiscountValue(discount.id, parseFloat(e.target.value) || 0)}
                              className="w-20"
                            />
                            <span className="text-sm text-gray-600">% off</span>
                          </div>
                        )}

                        {discount.type === 'free_deliveries' && discount.freeDeliveries !== undefined && (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">Free</span>
                            <Input
                              type="number"
                              min="0"
                              value={discount.freeDeliveries}
                              onChange={(e) => handleUpdateFreeDeliveries(discount.id, parseInt(e.target.value) || 0)}
                              className="w-20"
                            />
                            <span className="text-sm text-gray-600">deliveries</span>
                          </div>
                        )}

                        {discount.type === 'fixed_amount' && discount.value !== undefined && (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">₱</span>
                            <Input
                              type="number"
                              min="0"
                              value={discount.value}
                              onChange={(e) => handleUpdateDiscountValue(discount.id, parseFloat(e.target.value) || 0)}
                              className="w-24"
                            />
                            <span className="text-sm text-gray-600">off</span>
                          </div>
                        )}
                      </div>
                    ))}
                    <Button onClick={handleSaveDiscounts} className="w-full">Save Discount Changes</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="space-y-6">
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
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-xl font-normal text-black">Bookings</h2>
                    <p className="text-sm text-gray-500">
                      Customer, service, pickup date &amp; time, address, status and actions.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
                    <Input
                      placeholder="Search by name, email, or phone..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full md:w-72"
                    />
                    <Select value={filter} onValueChange={setFilter}>
                      <SelectTrigger className="w-full md:w-48 !bg-white !border !border-gray-300">
                        <SelectValue placeholder="Filter by status" />
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
              </div>
              <div className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Pickup Date &amp; Time</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium text-gray-900">
                              {booking.firstName} {booking.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.email}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 text-sm">
                            <div className="font-medium text-gray-900">
                              {getServiceTitle(booking.service)}
                            </div>
                            <div className="text-gray-600">
                              <span className="font-semibold">Soap:</span>{' '}
                              {getSoapLabel(booking.soapChoice)}
                            </div>
                            <div className="text-gray-600">
                              <span className="font-semibold">Payment:</span>{' '}
                              {getPaymentLabel(booking.paymentMethod)}
                            </div>
                            <div className="text-gray-700">
                              <span className="font-semibold text-emerald-600">
                                Total:
                              </span>{' '}
                              ₱{(booking.totalAmount || 0).toFixed(2)}
                            </div>
                            {booking.notes && (
                              <div className="text-gray-500 line-clamp-2">
                                <span className="font-semibold">Note:</span>{' '}
                                {booking.notes}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>{booking.date}</div>
                          <div className="text-sm text-gray-500">{booking.time}</div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs text-sm text-gray-700">
                            <div>{booking.street}</div>
                            <div className="text-gray-500">
                              {booking.city}, {booking.state} {booking.zip}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </TableCell>
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
                            <button
                              type="button"
                              onClick={() => onDeleteBooking(booking.id)}
                              className="text-sm font-medium text-red-500 hover:text-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Service Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {services.map((service) => (
                    <div key={service.id} className="border border-gray-200 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-medium">{service.title}</h4>
                          <Badge className={service.status === 'active' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}>
                            {service.status === 'active' ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const updatedServices = services.map<Service>(s =>
                                s.id === service.id
                                  ? {
                                      ...s,
                                      status: (s.status === 'active'
                                        ? 'inactive'
                                        : 'active') as Service['status'],
                                    }
                                  : s
                              );
                              onUpdateServices(updatedServices);
                            }}
                            className={service.status === 'active' ? 'border-red-300 text-red-600 hover:bg-red-50' : 'border-green-300 text-green-600 hover:bg-green-50'}
                          >
                            {service.status === 'active' ? 'Deactivate' : 'Activate'}
                          </Button>
                          <span className="text-sm text-gray-600">₱</span>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={service.price}
                            onChange={(e) => {
                              const updatedServices = services.map(s =>
                                s.id === service.id ? { ...s, price: parseFloat(e.target.value) || 0 } : s
                              );
                              onUpdateServices(updatedServices);
                            }}
                            className="w-24"
                          />
                          <span className="text-sm text-gray-600">{service.priceUnit}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{service.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Soap Prices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Soap (₱)</label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={soapPricesInput.soap}
                      onChange={(e) => handleSoapPriceChange('soap', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Pabcon (₱)</label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={soapPricesInput.pabcon}
                      onChange={(e) => handleSoapPriceChange('pabcon', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Both (₱)</label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={soapPricesInput.both}
                      onChange={(e) => handleSoapPriceChange('both', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
                <Button onClick={handleSaveSoapPrices} className="mt-4">Save Soap Prices</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Discount Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {discountsState.map((discount) => (
                    <div key={discount.id} className="border border-gray-200 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={discount.active}
                            onChange={() => handleToggleDiscount(discount.id)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <div>
                            <h4 className="font-medium">{discount.name}</h4>
                            <p className="text-sm text-gray-600">{discount.description}</p>
                          </div>
                        </div>
                        <Badge className={discount.active ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}>
                          {discount.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>

                      {discount.type === 'percentage' && discount.value !== undefined && (
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={discount.value}
                            onChange={(e) => handleUpdateDiscountValue(discount.id, parseFloat(e.target.value) || 0)}
                            className="w-20"
                          />
                          <span className="text-sm text-gray-600">% off</span>
                        </div>
                      )}

                      {discount.type === 'free_deliveries' && discount.freeDeliveries !== undefined && (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">Free</span>
                          <Input
                            type="number"
                            min="0"
                            value={discount.freeDeliveries}
                            onChange={(e) => handleUpdateFreeDeliveries(discount.id, parseInt(e.target.value) || 0)}
                            className="w-20"
                          />
                          <span className="text-sm text-gray-600">deliveries</span>
                        </div>
                      )}

                      {discount.type === 'fixed_amount' && discount.value !== undefined && (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">₱</span>
                          <Input
                            type="number"
                            min="0"
                            value={discount.value}
                            onChange={(e) => handleUpdateDiscountValue(discount.id, parseFloat(e.target.value) || 0)}
                            className="w-24"
                          />
                          <span className="text-sm text-gray-600">off</span>
                        </div>
                      )}
                    </div>
                  ))}
                  <Button onClick={handleSaveDiscounts} className="w-full">Save Discount Changes</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'discount' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Discount Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {discountsState.map((discount) => (
                    <div key={discount.id} className="border border-gray-200 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h4 className="font-medium">{discount.name}</h4>
                          <p className="text-sm text-gray-600">{discount.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={discount.active}
                            onChange={() => handleToggleDiscount(discount.id)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm">Active</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditDiscount(discount)}
                          >
                            Edit
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Type:</span> {discount.type.replace('_', ' ')}
                        </div>
                        <div>
                          <span className="font-medium">Value:</span>{' '}
                          {discount.type === 'percentage' && discount.value ? `${discount.value}%` :
                           discount.type === 'free_deliveries' && discount.freeDeliveries ? `${discount.freeDeliveries} deliveries` :
                           discount.type === 'fixed_amount' && discount.value ? `₱${discount.value}` :
                           'N/A'}
                        </div>
                        {discount.code && (
                          <div>
                            <span className="font-medium">Code:</span> {discount.code}
                          </div>
                        )}
                        {discount.usageLimitPerCustomer && (
                          <div>
                            <span className="font-medium">Usage Limit:</span> {discount.usageLimitPerCustomer} per customer
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {editingDiscount && (
              <Card>
                <CardHeader>
                  <CardTitle>Edit Discount</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Name</label>
                        <Input
                          value={editingDiscount.name}
                          onChange={(e) => handleUpdateEditingDiscount('name', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Type</label>
                        <Select
                          value={editingDiscount.type}
                          onValueChange={(value) => handleUpdateEditingDiscount('type', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="percentage">Percentage</SelectItem>
                            <SelectItem value="free_deliveries">Free Deliveries</SelectItem>
                            <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
                            <SelectItem value="free_shipping">Free Shipping</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        value={editingDiscount.description}
                        onChange={(e) => handleUpdateEditingDiscount('description', e.target.value)}
                      />
                    </div>

                    {editingDiscount.type === 'percentage' && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Percentage (%)</label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={editingDiscount.value || 0}
                          onChange={(e) => handleUpdateEditingDiscount('value', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    )}

                    {editingDiscount.type === 'free_deliveries' && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Free Deliveries</label>
                        <Input
                          type="number"
                          min="0"
                          value={editingDiscount.freeDeliveries || 0}
                          onChange={(e) => handleUpdateEditingDiscount('freeDeliveries', parseInt(e.target.value) || 0)}
                        />
                      </div>
                    )}

                    {editingDiscount.type === 'fixed_amount' && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Fixed Amount (₱)</label>
                        <Input
                          type="number"
                          min="0"
                          value={editingDiscount.value || 0}
                          onChange={(e) => handleUpdateEditingDiscount('value', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Coupon Code (Optional)</label>
                        <Input
                          value={editingDiscount.code || ''}
                          onChange={(e) => handleUpdateEditingDiscount('code', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Usage Limit per Customer</label>
                        <Input
                          type="number"
                          min="0"
                          value={editingDiscount.usageLimitPerCustomer || 0}
                          onChange={(e) => handleUpdateEditingDiscount('usageLimitPerCustomer', parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Eligibility</label>
                        <Select
                          value={editingDiscount.eligibility || 'all'}
                          onValueChange={(value) => handleUpdateEditingDiscount('eligibility', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Customers</SelectItem>
                            <SelectItem value="new_accounts">New Accounts Only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Expiry Days</label>
                        <Input
                          type="number"
                          min="0"
                          value={editingDiscount.expiryDaysAfterCreation || 0}
                          onChange={(e) => handleUpdateEditingDiscount('expiryDaysAfterCreation', parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Minimum Order (₱)</label>
                      <Input
                        type="number"
                        min="0"
                        value={editingDiscount.minimumOrder || 0}
                        onChange={(e) => handleUpdateEditingDiscount('minimumOrder', parseFloat(e.target.value) || 0)}
                      />
                    </div>

                    <div className="flex space-x-2">
                      <Button onClick={handleSaveEditDiscount}>Save Changes</Button>
                      <Button variant="outline" onClick={handleCancelEditDiscount}>Cancel</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
};