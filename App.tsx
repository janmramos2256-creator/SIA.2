import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AboutUs } from './components/AboutUs';
import { Services } from './components/Services';
import { BookingModal } from './components/BookingModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLogin } from './components/AdminLogin';
import { CustomerLogin } from './components/CustomerLogin';
import { MyAccount } from './components/MyAccount';
import { useState, useEffect } from 'react';

export interface Booking {
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

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isMyAccountOpen, setIsMyAccountOpen] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const currentUser = localStorage.getItem('smartwash-current-user');
    if (currentUser) {
      setIsCustomerLoggedIn(true);
      const user = JSON.parse(currentUser);
      setCurrentUserEmail(user.email || '');
      setCurrentUser(user);
    }
  }, []);

  useEffect(() => {
    const authToken = sessionStorage.getItem('smartwash-admin-auth');
    if (authToken === 'authenticated') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    const savedBookings = localStorage.getItem('smartwash-bookings');
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    } else {
      const mockBookings: Booking[] = [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Smith',
          email: 'john@example.com',
          phone: '09171234567',
          service: 'wash-dry-fold',
          date: '2026-01-25',
          time: '10:00',
          street: '123 Main St',
          city: 'Manila',
          state: 'Metro Manila',
          zip: '1000',
          notes: 'Please use fragrance-free detergent',
          paymentMethod: 'credit-card',
          soapChoice: 'soap',
          status: 'pending',
          createdAt: '2026-01-20T10:30:00',
          totalAmount: 270
        },
        {
          id: '2',
          firstName: 'Sarah',
          lastName: 'Johnson',
          email: 'sarah@example.com',
          phone: '09189876543',
          service: 'dry-cleaning',
          date: '2026-01-23',
          time: '14:00',
          street: '456 Oak Ave',
          city: 'Quezon City',
          state: 'Metro Manila',
          zip: '1100',
          notes: 'Suit for wedding',
          paymentMethod: 'cash',
          soapChoice: 'both',
          status: 'confirmed',
          createdAt: '2026-01-19T15:20:00',
          totalAmount: 385
        },
        {
          id: '3',
          firstName: 'Mike',
          lastName: 'Davis',
          email: 'mike@example.com',
          phone: '09154567890',
          service: 'express',
          date: '2026-01-22',
          time: '09:00',
          street: '789 Pine Rd',
          city: 'Makati',
          state: 'Metro Manila',
          zip: '1200',
          notes: '',
          paymentMethod: 'credit-card',
          soapChoice: 'soap',
          status: 'in-progress',
          createdAt: '2026-01-21T08:45:00',
          totalAmount: 320
        }
      ];
      setBookings(mockBookings);
      localStorage.setItem('smartwash-bookings', JSON.stringify(mockBookings));
    }
  }, []);

  // Save bookings to localStorage whenever they change
  useEffect(() => {
    if (bookings.length > 0) {
      localStorage.setItem('smartwash-bookings', JSON.stringify(bookings));
    }
  }, [bookings]);

  const addBooking = (booking: Omit<Booking, 'id' | 'status' | 'createdAt'>) => {
    const timestamp = new Date().toISOString();
    const newBooking: Booking = {
      ...booking,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: timestamp,
      statusLog: [{
        status: 'pending',
        timestamp: timestamp,
        changedBy: 'system'
      }]
    };
    setBookings([...bookings, newBooking]);
    setIsBookingOpen(false); // Close the booking modal
  };



  const updateBookingStatus = (id: string, status: Booking['status'], changedBy: 'admin' | 'customer' = 'admin') => {
    setBookings(bookings.map(booking => {
      if (booking.id === id) {
        const statusLog = booking.statusLog || [];
        return {
          ...booking,
          status,
          statusLog: [
            ...statusLog,
            {
              status,
              timestamp: new Date().toISOString(),
              changedBy
            }
          ]
        };
      }
      return booking;
    }));
  };

  const deleteBooking = (id: string) => {
    setBookings(bookings.filter(booking => booking.id !== id));
  };

  const handleLogin = (username: string, password: string) => {
    if (username === 'admin' && password === 'adminpass') {
      sessionStorage.setItem('smartwash-admin-auth', 'authenticated');
      setIsAuthenticated(true);
      setShowAdminLogin(false);
      if (window.location.hash) {
        window.location.hash = '';
      }
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    sessionStorage.removeItem('smartwash-admin-auth');
    setIsAuthenticated(false);
  };

  const handleCustomerLogin = () => {
    setIsCustomerLoggedIn(true);
  };

  const handleAdminAccessFromLogin = () => {
    setShowAdminLogin(true);
  };

  const handleMarkAsReceived = (id: string) => {
    updateBookingStatus(id, 'received', 'customer');
  };

  const handleCustomerLogout = () => {
    localStorage.removeItem('smartwash-current-user');
    setIsCustomerLoggedIn(false);
    setCurrentUserEmail('');
    setCurrentUser(null);
  };

  if (isAuthenticated) {
    return (
      <AdminDashboard
        bookings={bookings}
        onUpdateStatus={updateBookingStatus}
        onDeleteBooking={deleteBooking}
        onLogout={handleLogout}
      />
    );
  }

  if (showAdminLogin) {
    return (
      <AdminLogin
        onLogin={handleLogin}
        onClose={() => setShowAdminLogin(false)}
      />
    );
  }

  if (!isCustomerLoggedIn) {
    return <CustomerLogin onLogin={handleCustomerLogin} onAdminAccess={handleAdminAccessFromLogin} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header
        onBookingClick={() => setIsBookingOpen(true)}
        onMyAccountClick={() => setIsMyAccountOpen(true)}
        onLogout={handleCustomerLogout}
        onHomeClick={() => scrollToSection('home')}
        onAboutClick={() => scrollToSection('about')}
        onServicesClick={() => scrollToSection('services')}
      />
      <div id="home">
        <Hero onBookingClick={() => setIsBookingOpen(true)} />
      </div>
      <div id="about">
        <AboutUs />
      </div>
      <div id="services">
        <Services />
      </div>
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onSubmit={addBooking}
        currentUser={currentUser}
      />
      <MyAccount
        isOpen={isMyAccountOpen}
        onClose={() => setIsMyAccountOpen(false)}
        bookings={bookings}
        currentUserEmail={currentUserEmail}
        onMarkAsReceived={handleMarkAsReceived}
      />
    </div>
  );
}