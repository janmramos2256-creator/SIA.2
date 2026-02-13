import React from 'react';

interface BookingConfirmationProps {
  isOpen: boolean;
  onConfirm: () => void;
  booking: any; // Can be either pending booking data or full booking
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  isOpen,
  onConfirm,
  booking
}) => {
  const printReceipt = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow && booking) {
      const bookingId = booking.id || 'PENDING';
      const bookingStatus = booking.status || 'pending';
      const createdDate = booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : new Date().toLocaleDateString();

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>SmartWash Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; border-bottom: 2px solid #2fb5b4; padding-bottom: 10px; margin-bottom: 20px; }
            .logo { color: #2fb5b4; font-size: 24px; font-weight: bold; }
            .receipt-title { color: #333; font-size: 18px; margin: 10px 0; }
            .details { margin: 15px 0; }
            .detail-row { display: flex; justify-content: space-between; margin: 5px 0; padding: 5px 0; border-bottom: 1px solid #eee; }
            .total { font-weight: bold; font-size: 16px; border-top: 2px solid #2fb5b4; margin-top: 10px; padding-top: 10px; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">SmartWash</div>
            <div class="receipt-title">Booking Receipt</div>
            <div>Booking ID: ${bookingId}</div>
            <div>Date: ${createdDate}</div>
          </div>

          <div class="details">
            <div class="detail-row">
              <span>Customer:</span>
              <span>${booking.firstName} ${booking.lastName}</span>
            </div>
            <div class="detail-row">
              <span>Email:</span>
              <span>${booking.email}</span>
            </div>
            <div class="detail-row">
              <span>Phone:</span>
              <span>${booking.phone}</span>
            </div>
            <div class="detail-row">
              <span>Service:</span>
              <span>${booking.service}</span>
            </div>
            <div class="detail-row">
              <span>Pickup Date:</span>
              <span>${booking.date}</span>
            </div>
            <div class="detail-row">
              <span>Pickup Time:</span>
              <span>${booking.time}</span>
            </div>
            <div class="detail-row">
              <span>Address:</span>
              <span>${booking.street}, ${booking.city}, ${booking.state} ${booking.zip}</span>
            </div>
            <div class="detail-row">
              <span>Soap Choice:</span>
              <span>${booking.soapChoice === 'bring-own' ? 'Bring my own' :
                     booking.soapChoice === 'soap' ? 'Soap (₱18)' :
                     booking.soapChoice === 'pabcon' ? 'Pabcon (₱15)' :
                     'Soap & Pabcon (₱30)'}</span>
            </div>
            ${booking.deliveryOption ? `
            <div class="detail-row">
              <span>Delivery Distance:</span>
              <span>${booking.deliveryDistance} km</span>
            </div>
            <div class="detail-row">
              <span>Delivery Fee:</span>
              <span>₱${booking.deliveryFee?.toFixed(2)}</span>
            </div>
            ` : ''}
            <div class="detail-row">
              <span>Payment Method:</span>
              <span>${booking.paymentMethod === 'cash' ? 'Cash' :
                     booking.paymentMethod === 'g-cash' ? 'G-Cash' :
                     'Maya'}</span>
            </div>
            <div class="detail-row total">
              <span>Total Amount:</span>
              <span>₱${booking.totalAmount?.toFixed(2)}</span>
            </div>
          </div>

          <div class="footer">
            <div>Thank you for choosing SmartWash!</div>
            <div>Status: ${bookingStatus.toUpperCase()}</div>
            <div>For inquiries, contact us at support@smartwash.com</div>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border-2 border-teal-500">
        <div className="text-center mb-6">
          <h2 className="text-2xl text-teal-600 font-bold">📋 Confirm Your Booking</h2>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Your booking is ready for confirmation!</h2>
            <p className="text-gray-600 mt-2">Please review the details below and confirm your booking.</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Transaction Summary</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Customer Information</h4>
                <p><span className="font-medium">Name:</span> {booking.firstName} {booking.lastName}</p>
                <p><span className="font-medium">Email:</span> {booking.email}</p>
                <p><span className="font-medium">Phone:</span> {booking.phone}</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-2">Service Details</h4>
                <p><span className="font-medium">Service:</span> {booking.service}</p>
                <p><span className="font-medium">Date:</span> {booking.date}</p>
                <p><span className="font-medium">Time:</span> {booking.time}</p>
                <p><span className="font-medium">Soap Choice:</span> {
                  booking.soapChoice === 'bring-own' ? 'Bring my own' :
                  booking.soapChoice === 'soap' ? 'Soap (₱18)' :
                  booking.soapChoice === 'pabcon' ? 'Pabcon (₱15)' :
                  'Soap & Pabcon (₱30)'
                }</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center text-sm">
                <span>Service Charge:</span>
                <span>₱{((booking.totalAmount || 0) - (booking.deliveryFee || 0)).toFixed(2)}</span>
              </div>
              {booking.deliveryOption && (
                <div className="flex justify-between items-center text-sm">
                  <span>Delivery Fee ({booking.deliveryDistance}km):</span>
                  <span>₱{booking.deliveryFee?.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-lg font-bold text-teal-600 pt-2 border-t border-gray-300 mt-2">
                <span>Total Amount:</span>
                <span>₱{booking.totalAmount?.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              <p><span className="font-medium">Payment Method:</span> {
                booking.paymentMethod === 'cash' ? 'Cash' :
                booking.paymentMethod === 'g-cash' ? 'G-Cash' :
                'Maya'
              }</p>
              <p><span className="font-medium">Status:</span> <span className="text-blue-600 font-medium">PENDING CONFIRMATION</span></p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={printReceipt}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
            >
              🖨️ Print Receipt
            </button>
            <button
              onClick={onConfirm}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded"
            >
              ✅ Confirm Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};