import React from 'react';

interface Service {
  id: string;
  title: string;
  price: number;
  priceUnit: string;
}

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

interface MyAccountProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  services?: Service[];
  currentUserEmail: string;
  onMarkAsReceived: (id: string) => void;
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-blue-100 text-blue-800',
  'in-progress': 'bg-teal-100 text-teal-800',
  'in-transit': 'bg-indigo-100 text-indigo-800',
  completed: 'bg-green-100 text-green-800',
  received: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
};

const formatSoap = (soap: string) => {
  if (soap === 'bring-own') return 'Bring my own';
  if (soap === 'soap') return 'Soap';
  if (soap === 'pabcon') return 'Pabcon';
  if (soap === 'both') return 'Soap & Pabcon';
  return soap;
};

const formatPayment = (method: string) => {
  if (method === 'g-cash') return 'G-Cash';
  if (method === 'maya') return 'Maya';
  return method?.charAt(0).toUpperCase() + (method?.slice(1) || '');
};

export const MyAccount: React.FC<MyAccountProps> = ({
  isOpen,
  onClose,
  bookings,
  services = [],
  currentUserEmail,
  onMarkAsReceived
}) => {
  const userBookings = bookings
    .filter((b) => b.email?.toLowerCase() === currentUserEmail?.toLowerCase())
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getServiceName = (id: string) => services.find((s) => s.id === id)?.title || id;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">My Account</h1>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl" aria-label="Close">
            ×
          </button>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-600">{currentUserEmail || 'Your account'}</p>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome Offer</h3>
            <p className="text-sm text-gray-700">
              As a new customer, you get <span className="font-semibold text-teal-600">2 free delivery services</span> on your first two bookings.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">My Transactions</h3>
            <p className="text-sm text-gray-500 mb-4">Track and monitor your laundry bookings.</p>
            {userBookings.length === 0 ? (
              <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center">
                <p className="text-gray-500">No bookings yet.</p>
                <p className="text-sm text-gray-400 mt-1">Book a service to see your transactions here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {userBookings.map((booking) => (
                  <div key={booking.id} className="border border-gray-200 rounded-lg p-5 hover:border-teal-300 transition-colors">
                    <div className="flex flex-wrap justify-between items-start gap-3 mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900">Booking #{booking.id.slice(-6)}</h4>
                        <p className="text-sm text-gray-500">
                          {booking.date} at {booking.time}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[booking.status] || 'bg-gray-100 text-gray-800'}`}>
                        {booking.status.replace(/-/g, ' ')}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 font-medium">Service</p>
                        <p className="text-gray-900">{getServiceName(booking.service)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium">Total</p>
                        <p className="text-gray-900 font-semibold">₱{(booking.totalAmount || 0).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium">Payment</p>
                        <p className="text-gray-900">{formatPayment(booking.paymentMethod)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium">Soap</p>
                        <p className="text-gray-900">{formatSoap(booking.soapChoice)}</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-gray-500 text-sm font-medium">Address</p>
                      <p className="text-gray-700 text-sm">
                        {booking.street}, {booking.city}, {booking.state} {booking.zip}
                      </p>
                    </div>
                    {booking.notes && (
                      <div className="mt-3">
                        <p className="text-gray-500 text-sm font-medium">Notes</p>
                        <p className="text-gray-600 text-sm">{booking.notes}</p>
                      </div>
                    )}
                    {booking.status === 'completed' && (
                      <div className="mt-4">
                        <button
                          onClick={() => onMarkAsReceived(booking.id)}
                          className="w-full py-2 px-4 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700 transition-colors"
                        >
                          Mark as Received
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};