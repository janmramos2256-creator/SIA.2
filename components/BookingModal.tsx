import React, { useState, useEffect } from 'react';

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

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (booking: any) => void;
  currentUser?: any;
  services: Service[];
  discounts: Discount[];
  soapPrices: SoapPrices;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, onSubmit, currentUser, services, discounts, soapPrices }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', service: '', date: '', time: '',
    street: '', city: '', state: '', zip: '', notes: '', paymentMethod: '', soapChoice: '',
    deliveryOption: false, deliveryDistance: '', deliveryFee: 0, totalAmount: 0, couponCode: ''
  });

  useEffect(() => {
    if (isOpen) {
      setShowConfirmation(false);
      const savedUser = localStorage.getItem('smartwash-booking-user') || localStorage.getItem('smartwash-current-user');
      const savedData = savedUser ? JSON.parse(savedUser) : null;
      const firstName = currentUser?.firstName || savedData?.firstName || '';
      const lastName = currentUser?.lastName || savedData?.lastName || '';
      const email = currentUser?.email || savedData?.email || '';
      const phone = currentUser?.cellNumber || savedData?.cellNumber || savedData?.phone || '';
      setFormData(prev => ({ ...prev, firstName, lastName, email, phone }));
      if (firstName || lastName || email || phone) {
        localStorage.setItem('smartwash-booking-user', JSON.stringify({ firstName, lastName, email, phone }));
      }
    } else if (!isOpen) {
      setFormData(prev => ({
        ...prev, service: '', date: '', time: '', street: '', city: '', state: '', zip: '',
        notes: '', paymentMethod: '', soapChoice: '', deliveryOption: false, deliveryDistance: '', deliveryFee: 0, totalAmount: 0, couponCode: ''
      }));
    }
  }, [isOpen, currentUser]);

  const getMinDate = () => new Date().toISOString().split('T')[0];

  const isValidTime = (time: string) => !time || (Number(time.split(':')[0]) >= 8 && Number(time.split(':')[0]) < 18);
  const getPromotionalDiscount = () => {
    const promoDiscount = discounts.find(d => d.id === 'promotional' && d.active && d.type === 'percentage');
    return promoDiscount?.value || 0;
  };

  const getNewUserFreeDeliveries = () => {
    const freeDeliveryDiscount = discounts.find(d => d.id === 'new-user-free-deliveries' && d.active && d.type === 'free_deliveries');
    return freeDeliveryDiscount?.freeDeliveries || 0;
  };

  const getCouponDiscount = () => {
    if (!formData.couponCode) return { discount: 0, type: null };

    const coupon = discounts.find(d => d.code === formData.couponCode && d.active);
    if (!coupon) return { discount: 0, type: null };

    // Check eligibility
    if (coupon.eligibility === 'new_accounts') {
      const users = JSON.parse(localStorage.getItem('smartwash-users') || '[]');
      const user = users.find((u: any) => u.email === formData.email);
      if (!user) return { discount: 0, type: null }; // Not a registered user

      const createdAt = new Date(user.createdAt);
      const now = new Date();
      const daysSinceCreation = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceCreation > 30) return { discount: 0, type: null }; // Account too old
    }

    // Check expiry
    if (coupon.expiryDaysAfterCreation) {
      const users = JSON.parse(localStorage.getItem('smartwash-users') || '[]');
      const user = users.find((u: any) => u.email === formData.email);
      if (user) {
        const createdAt = new Date(user.createdAt);
        const now = new Date();
        const daysSinceCreation = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceCreation > coupon.expiryDaysAfterCreation) return { discount: 0, type: null };
      }
    }

    // Check usage limit
    if (coupon.usageLimitPerCustomer) {
      const usageKey = `smartwash-coupon-usage-${coupon.id}`;
      const usage = JSON.parse(localStorage.getItem(usageKey) || '{}');
      const userUsage = usage[formData.email] || 0;
      if (userUsage >= coupon.usageLimitPerCustomer) return { discount: 0, type: null };
    }

    // Check minimum order
    const subtotal = (() => {
      let total = 0;
      const selectedService = services.find(s => s.id === formData.service);
      if (selectedService) total += selectedService.price;
      const soapPricesCalc = soapPrices;
      total += soapPricesCalc[formData.soapChoice as keyof typeof soapPricesCalc] || 0;
      const promoDiscount = getPromotionalDiscount();
      if (promoDiscount > 0) total = total * (1 - promoDiscount / 100);
      return total;
    })();

    if (coupon.minimumOrder && subtotal < coupon.minimumOrder) return { discount: 0, type: null };

    if (coupon.type === 'free_shipping') {
      return { discount: formData.deliveryFee, type: 'free_shipping' };
    }

    return { discount: 0, type: null };
  };

  const calculateDeliveryFee = (distanceKm: number): number => {
    if (!distanceKm || distanceKm <= 0) return 0;

    if (distanceKm <= 3) {
      // Within 3km: simple tiered pricing between ₱100 - ₱200
      if (distanceKm <= 1) return 100;
      if (distanceKm <= 2) return 150;
      return 200;
    }

    // Beyond 3km: ₱200 base + ₱8 per 50 meters
    const extraMeters = (distanceKm - 3) * 1000;
    const increments = Math.ceil(extraMeters / 50);
    return 200 + increments * 8;
  };

  const handleTimeChange = (time: string) => {
    if (!isValidTime(time)) {
      alert('Please select a time between 8:00 and 5:59 PM.');
      return;
    }
    setFormData(prev => ({ ...prev, time }));
  };

  useEffect(() => {
    let total = 0;
    const selectedService = services.find(s => s.id === formData.service);
    if (selectedService) {
      total += selectedService.price;
    }
    const soapPricesCalc = soapPrices;
    total += soapPricesCalc[formData.soapChoice as keyof typeof soapPricesCalc] || 0;
    
    // Apply promotional discount
    const promoDiscount = getPromotionalDiscount();
    if (promoDiscount > 0) {
      total = total * (1 - promoDiscount / 100);
    }
    
    let deliveryFee = formData.deliveryOption && formData.deliveryDistance
      ? calculateDeliveryFee(parseFloat(formData.deliveryDistance))
      : 0;

    // Apply new user free deliveries, if any
    const newUserFreeDeliveries = getNewUserFreeDeliveries();
    if (newUserFreeDeliveries > 0 && formData.deliveryOption) {
      deliveryFee = 0;
    }
    
    // Apply coupon discount
    const couponDiscount = getCouponDiscount();
    let finalDeliveryFee = deliveryFee;
    if (couponDiscount.type === 'free_shipping') {
      finalDeliveryFee = Math.max(0, deliveryFee - couponDiscount.discount);
    }
    
    setFormData(prev => ({ ...prev, deliveryFee: finalDeliveryFee, totalAmount: total + finalDeliveryFee }));
  }, [formData.service, formData.soapChoice, formData.deliveryOption, formData.deliveryDistance, formData.couponCode, formData.email, services, discounts, soapPrices]);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setShowConfirmation(true); };
  const handleFinalSubmit = () => {
    // Track coupon usage
    if (formData.couponCode) {
      const coupon = discounts.find(d => d.code === formData.couponCode && d.active);
      if (coupon && getCouponDiscount().discount > 0) {
        const usageKey = `smartwash-coupon-usage-${coupon.id}`;
        const usage = JSON.parse(localStorage.getItem(usageKey) || '{}');
        usage[formData.email] = (usage[formData.email] || 0) + 1;
        localStorage.setItem(usageKey, JSON.stringify(usage));
      }
    }
    onSubmit(formData);
    onClose();
  };
  const handleBackToForm = () => setShowConfirmation(false);
  const handleInputChange = (field: string, value: string | boolean) => setFormData(prev => ({ ...prev, [field]: value }));
  const getServiceLabel = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      let label = `${service.title} (₱${service.price}${service.priceUnit})`;
      const promoDiscount = getPromotionalDiscount();
      if (promoDiscount > 0) {
        const discountedPrice = service.price * (1 - promoDiscount / 100);
        label += ` - ${promoDiscount}% OFF = ₱${discountedPrice.toFixed(2)}${service.priceUnit}`;
      }
      return label;
    }
    return 'Not selected';
  };
  const getSoapLabel = (soap: string) => {
    if (soap === 'bring-own') return 'Bring my own';
    if (soap === 'soap') return `Soap (₱${soapPrices.soap})`;
    if (soap === 'pabcon') return `Pabcon (₱${soapPrices.pabcon})`;
    if (soap === 'both') return `Soap & Pabcon (₱${soapPrices.both})`;
    return '';
  };
  const getPaymentLabel = (method: string) => method === 'cash' ? 'Cash' : method === 'g-cash' ? 'G-Cash' : 'Maya';

  const handlePrintReceipt = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
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
            <div class="receipt-title">Booking Receipt Preview</div>
            <div>Date: ${new Date().toLocaleDateString()}</div>
          </div>

          <div class="details">
            <div class="detail-row">
              <span>Customer:</span>
              <span>${formData.firstName} ${formData.lastName}</span>
            </div>
            <div class="detail-row">
              <span>Email:</span>
              <span>${formData.email}</span>
            </div>
            <div class="detail-row">
              <span>Phone:</span>
              <span>${formData.phone}</span>
            </div>
            <div class="detail-row">
              <span>Service:</span>
              <span>${formData.service}</span>
            </div>
            <div class="detail-row">
              <span>Pickup Date:</span>
              <span>${formData.date}</span>
            </div>
            <div class="detail-row">
              <span>Pickup Time:</span>
              <span>${formData.time}</span>
            </div>
            <div class="detail-row">
              <span>Address:</span>
              <span>${formData.street}, ${formData.city}, ${formData.state} ${formData.zip}</span>
            </div>
            <div class="detail-row">
              <span>Soap Choice:</span>
              <span>${getSoapLabel(formData.soapChoice)}</span>
            </div>
            ${formData.deliveryOption ? `
            <div class="detail-row">
              <span>Delivery Distance:</span>
              <span>${formData.deliveryDistance} km</span>
            </div>
            <div class="detail-row">
              <span>Delivery Fee:</span>
              <span>₱${formData.deliveryFee?.toFixed(2)}</span>
            </div>
            ` : ''}
            <div class="detail-row">
              <span>Payment Method:</span>
              <span>${getPaymentLabel(formData.paymentMethod)}</span>
            </div>
            <div class="detail-row total">
              <span>Total Amount:</span>
              <span>₱${formData.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div class="footer">
            <div>Thank you for choosing SmartWash!</div>
            <div>Status: PENDING CONFIRMATION</div>
            <div>For inquiries, contact us at support@smartwash.com</div>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {!showConfirmation ? (
          <>
            <h2 className="text-xl font-bold mb-4">Book Your Laundry Service</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                  if (value.length <= 11) {
                    handleInputChange('phone', value);
                  }
                }}
                maxLength={11}
                pattern="[0-9]{11}"
                placeholder="09123456789"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Service Type</label>
            <select
              className="w-full p-2 border border-gray-300 rounded bg-white"
              value={formData.service}
              onChange={(e) => handleInputChange('service', e.target.value)}
              required
            >
              <option value="">Select a service</option>
              {services.filter(service => service.status === 'active').map((service) => (
                <option key={service.id} value={service.id}>
                  {service.title} (₱{service.price}{service.priceUnit})
                  {getPromotionalDiscount() > 0 && ` - ${getPromotionalDiscount()}% OFF`}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Pickup Date</label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                min={getMinDate()}
                required
              />
              <div className="text-xs text-gray-500 mt-1">Must be today or later</div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Pickup Time</label>
              <input
                type="time"
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.time}
                onChange={(e) => handleTimeChange(e.target.value)}
                min="08:00"
                max="17:59"
                required
              />
              <div className="text-xs text-gray-500 mt-1">Business hours: 8:00 AM - 6:00 PM</div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Street Address</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={formData.street}
              onChange={(e) => handleInputChange('street', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">State/Province</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">ZIP Code</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.zip}
                onChange={(e) => handleInputChange('zip', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Special Instructions</label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Any special care instructions..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Soap Choice</label>
            <select
              className="w-full p-2 border border-gray-300 rounded bg-white"
              value={formData.soapChoice}
              onChange={(e) => handleInputChange('soapChoice', e.target.value)}
            >
              <option value="">Select soap choice</option>
              <option value="bring-own">Bring my own soap/pabcon</option>
              <option value="soap">Soap (₱{soapPrices.soap})</option>
              <option value="pabcon">Pabcon (₱{soapPrices.pabcon})</option>
              <option value="both">Soap & Pabcon (₱{soapPrices.both})</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Payment Method</label>
            <select
              className="w-full p-2 border border-gray-300 rounded bg-white"
              value={formData.paymentMethod}
              onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
              required
            >
              <option value="">Select payment method</option>
              <option value="cash">Cash</option>
              <option value="g-cash">G-cash</option>
              <option value="maya">Maya</option>
            </select>
          </div>

          <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="delivery"
                checked={formData.deliveryOption}
                onChange={(e) => handleInputChange('deliveryOption', e.target.checked)}
                className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500"
              />
              <label htmlFor="delivery" className="text-base font-medium">
                Add Delivery Service
              </label>
            </div>

            {formData.deliveryOption && (
              <div className="space-y-4 ml-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Distance from our location (km)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={formData.deliveryDistance}
                    onChange={(e) => handleInputChange('deliveryDistance', e.target.value)}
                    placeholder="Enter distance in kilometers"
                    required={formData.deliveryOption}
                  />
                </div>

                <div className="text-sm text-gray-600 bg-white p-3 rounded border">
                  <h4 className="font-medium mb-2">Delivery Fee Breakdown:</h4>
                  <ul className="space-y-1">
                    <li>• Within 3km: ₱100 - ₱200</li>
                    <li>• Beyond 3km: ₱200 + ₱8 per 50 meters</li>
                  </ul>
                  {formData.deliveryDistance && (
                    <p className="mt-2 font-medium text-teal-600">
                      Your delivery fee: ₱{formData.deliveryFee.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Coupon Code (Optional)</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={formData.couponCode}
              onChange={(e) => handleInputChange('couponCode', e.target.value.toUpperCase())}
              placeholder="Enter coupon code"
            />
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Payment Summary</h3>
            <div className="space-y-1">
              <p className="text-sm">Service: {getServiceLabel(formData.service)}</p>
              <p className="text-sm">Soap Choice: {formData.soapChoice ? getSoapLabel(formData.soapChoice) : 'Not selected'}</p>
              {formData.deliveryOption && <p className="text-sm">Delivery Fee: ₱{formData.deliveryFee.toFixed(2)}</p>}
              {formData.couponCode && getCouponDiscount().discount > 0 && (
                <p className="text-sm text-green-600">Coupon ({formData.couponCode}): -₱{getCouponDiscount().discount.toFixed(2)}</p>
              )}
              <p className="text-sm">Payment Method: {formData.paymentMethod ? getPaymentLabel(formData.paymentMethod) : 'Not selected'}</p>
              <p className="text-lg font-bold">Total: ₱{(formData.totalAmount || 0).toFixed(2)}</p>
            </div>
          </div>

          <div className="flex justify-between gap-4 mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gray-100 text-black rounded-lg hover:bg-gray-200 font-medium border border-gray-300"
            >
              Confirm Booking
            </button>
          </div>
        </form>
        </>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-4">Confirm Your Booking</h2>
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                    <p><strong>Email:</strong> {formData.email}</p>
                    <p><strong>Phone:</strong> {formData.phone}</p>
                    <p><strong>Service:</strong> {formData.service}</p>
                  </div>
                  <div>
                    <p><strong>Date:</strong> {formData.date}</p>
                    <p><strong>Time:</strong> {formData.time}</p>
                    <p><strong>Address:</strong> {formData.street}, {formData.city}</p>
                    <p><strong>Soap Choice:</strong> {formData.soapChoice}</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Payment Summary</h3>
                <div className="space-y-1">
                  <p>Service: {getServiceLabel(formData.service)}</p>
                  <p>Soap Choice: {getSoapLabel(formData.soapChoice)}</p>
                  {formData.deliveryOption && <p>Delivery Fee: ₱{formData.deliveryFee?.toFixed(2)}</p>}
                  {formData.couponCode && getCouponDiscount().discount > 0 && (
                    <p className="text-green-600">Coupon ({formData.couponCode}): -₱{getCouponDiscount().discount.toFixed(2)}</p>
                  )}
                  <p>Payment Method: {getPaymentLabel(formData.paymentMethod)}</p>
                  <p className="text-lg font-bold">Total: ₱{formData.totalAmount.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex justify-between gap-3">
                <button
                  type="button"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                  onClick={handleBackToForm}
                >
                  Back to Edit
                </button>
                <button
                  type="button"
                  className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 border border-blue-300"
                  onClick={handlePrintReceipt}
                >
                  🖨️ Print Receipt
                </button>
                <button
                  type="button"
                  className="flex-1 px-4 py-2 bg-gray-100 text-black rounded hover:bg-gray-200 border border-gray-300"
                  onClick={handleFinalSubmit}
                >
                  Confirm & Book
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};