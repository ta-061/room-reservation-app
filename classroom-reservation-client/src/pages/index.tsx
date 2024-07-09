import { GetStaticProps } from 'next';
import React, { useState, useEffect } from 'react';
import BigCalendarComponent from '../componts/BigCalendarComponent';

interface Reservation {
  id: number;
  user_name: string;
  classroom_id: number;
  classroom_name: string; // APIから取得する教室名
  start_time: string;
  end_time: string;
}

interface IndexPageProps {
  initialReservations: Reservation[];
}

const IndexPage: React.FC<IndexPageProps> = ({ initialReservations }) => {
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations);

  const fetchReservations = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/reservations');
      const data = await response.json();
      setReservations(data);
    } catch (error) {
      console.error('Failed to fetch reservations:', error);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return (
    <div className="container">
      <h1>教室予約システム</h1>
      <BigCalendarComponent reservations={reservations} refreshReservations={fetchReservations} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/v1/reservations');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const initialReservations: Reservation[] = await response.json();

    return {
      props: {
        initialReservations,
      },
      revalidate: 10, // 10秒ごとにページを再生成
    };
  } catch (error) {
    console.error('Failed to fetch reservations during static generation:', error);
    return {
      props: {
        initialReservations: [],
      },
    };
  }
};

export default IndexPage;
