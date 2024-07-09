import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import BigCalendarComponent from '../componts/BigCalendarComponent';

interface Reservation {
  id: number;
  user_name: string;
  classroom_id: number;
  classroom_name: string;
  start_time: string;
  end_time: string;
}

const CalendarPage: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedPassword = sessionStorage.getItem('password');
    const savedTimestamp = sessionStorage.getItem('timestamp');
    const currentTime = new Date().getTime();
    const FIVE_MINUTES = 5 * 60 * 1000;

    if (savedPassword && savedTimestamp && currentTime - parseInt(savedTimestamp) < FIVE_MINUTES) {
      authenticate(savedPassword);
    } else {
      sessionStorage.removeItem('password');
      sessionStorage.removeItem('timestamp');
      router.push('/login');
    }
  }, []);

  const authenticate = async (password: string) => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        fetchReservations();
      } else {
        router.push('/login');
      }
    } catch (error) {
      router.push('/login');
    }
  };

  const fetchReservations = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/reservations');
      const data = await response.json();
      setReservations(data);
    } catch (error) {
      console.error('Failed to fetch reservations:', error);
    }
  };

  return (
    <div className="container">
      <h1>教室予約システム</h1>
      {isAuthenticated && (
        <BigCalendarComponent reservations={reservations} refreshReservations={fetchReservations} />
      )}
    </div>
  );
};

export default CalendarPage;
