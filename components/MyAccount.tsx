import React from 'react';

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
  currentUserEmail: string;
  onMarkAsReceived: (id: string) => void;
}

export const MyAccount: React.FC<MyAccountProps> = ({
  isOpen,
  onClose,
  bookings,
  currentUserEmail,
  onMarkAsReceived
}) => {
  const userBookings = bookings.filter(booking => booking.email === currentUserEmail);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-xl font-normal text-black">My Account - {currentUserEmail}</h1>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-normal text-black mb-4">My Bookings</h3>
            {userBookings.length === 0 ? (
              <p className="text-gray-600">No bookings found.</p>
            ) : (
              <div className="space-y-4">
                {userBookings.map((booking) => (
                  <div key={booking.id} className="border border-gray-200 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-base font-normal text-black">
                          Booking #{booking.id.slice(-6)}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {booking.date} at {booking.time}
                        </p>
                      </div>
                      <span className="text-sm text-gray-600">
                        {booking.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium">Service</p>
                        <p className="text-sm text-gray-600">{booking.service}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Amount</p>
                        <p className="text-sm text-gray-600">₱{(booking.totalAmount || 0).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Payment</p>
                        <p className="text-sm text-gray-600">{booking.paymentMethod}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Soap Choice</p>
                        <p className="text-sm text-gray-600">{booking.soapChoice}</p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="text-sm font-medium">Address</p>
                      <p className="text-sm text-gray-600">
                        {booking.street}, {booking.city}, {booking.state} {booking.zip}
                      </p>
                    </div>
                    {booking.notes && (
                      <div className="mb-4">
                        <p className="text-sm font-medium">Notes</p>
                        <p className="text-sm text-gray-600">{booking.notes}</p>
                      </div>
                    )}
                    {booking.status === 'completed' && (
                      <div className="mt-4">
                        <button
                          onClick={() => onMarkAsReceived(booking.id)}
                          className="w-full bg-black text-white hover:bg-gray-800 transition-colors py-2 px-4 rounded"
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