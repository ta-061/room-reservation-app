import React, { useState, useEffect } from 'react';
import { Calendar,Views, View, SlotInfo, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import CreateReservationForm from './CreateReservationForm';
import DeleteReservationForm from './DeleteReservationForm';
import 'moment/locale/ja';
const localizer = momentLocalizer(moment);

interface Reservation {
  id: number;
  user_name: string;
  classroom_id: number;
  classroom_name: string;  // APIから取得する教室名
  start_time: string;
  end_time: string;
}

interface BigCalendarComponentProps {
  reservations: Reservation[];
  refreshReservations: () => void;
}

const classroomOptions = [
  { id: 1, title: '実験室221', color: '#f56c6c' },
  { id: 2, title: 'ゼミ室222', color: '#e6a23c' },
  { id: 3, title: '実験室231', color: '#5cb87a' },
  { id: 4, title: '演習室241', color: '#409eff' },
  { id: 5, title: 'PBL室242', color: '#d87cdd' }
];

const BigCalendarComponent: React.FC<BigCalendarComponentProps> = ({ reservations = [], refreshReservations }) => {
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date, end: Date, resourceId: number } | null>(null);
  const [selectedReservation, setSelectedReservation] = useState<{ id: number, details: Reservation } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<View>(Views.WEEK);

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    const { start, end, resourceId } = slotInfo;
    const dayOfWeek = start.getDay();
    const startHour = start.getHours();
    const endHour = end.getHours();

    // 日曜日は予約できません
    if (dayOfWeek === 0) {
      setError('日曜日は予約できません。');
      return;
    }

    // 8:00から18:00の範囲でのみ予約可能
    if (startHour < 8 || endHour > 18) {
      setError('予約は8:00から18:00の範囲内でのみ可能です。');
      return;
    }

    setSelectedSlot({ start, end, resourceId: resourceId ? Number(resourceId) : 1 });
    setSelectedReservation(null);  // 予約作成時には削除フォームを非表示
    setError(null); // エラーリセット
  };

  const handleSelectEvent = (event: any) => {
    const reservationDetails = reservations.find(reservation => reservation.id === event.id);
    if (reservationDetails) {
      setSelectedReservation({ id: event.id, details: reservationDetails });
      setSelectedSlot(null);  // 予約削除時には作成フォームを非表示
    }
  };

  const handleFormComplete = () => {
    setSelectedSlot(null);
    setSelectedReservation(null);
    refreshReservations();
  };

  const handleViewChange = (view: View) => {
    setCurrentView(view);
  };

  const eventPropGetter = (event: any, start: Date, end: Date, isSelected: boolean) => {
    const classroom = classroomOptions.find(room => room.id === event.resourceId);
    return {
      style: {
        backgroundColor: classroom ? classroom.color : '#3174ad',
      },
    };
  };

  const events = reservations.map(reservation => {
    return {
      id: reservation.id,
      title: `${reservation.user_name} - ${reservation.classroom_name}`,
      start: new Date(reservation.start_time),
      end: new Date(reservation.end_time),
      resourceId: reservation.classroom_id
    };
  });

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        defaultView={Views.WEEK}
        onView={handleViewChange}
        style={{ height: 600 }}
        min={new Date(1970, 1, 1, 8, 0, 0)}
        max={new Date(1970, 1, 1, 18, 0, 0)}
        views={{ week: true, day: true }}
        eventPropGetter={eventPropGetter}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {selectedSlot ? (
        <CreateReservationForm selectedSlot={selectedSlot} refreshReservations={handleFormComplete} />
      ) : selectedReservation ? (
        <DeleteReservationForm reservationId={selectedReservation.id} reservationDetails={selectedReservation.details} refreshReservations={handleFormComplete} />
      ) : (
        <div>
          <h2>使い方</h2>
          <p>カレンダーで予約したい日付と時間を選択すると、予約フォームが表示されます。</p>
          <p>既存の予約を削除するには、カレンダー上の予約をクリックすると、削除フォームが表示されます。</p>
          <h3>教室ごとのカラーコード:</h3>
          <ul>
            {classroomOptions.map(option => (
              <li key={option.id}>
                <span style={{ backgroundColor: option.color, padding: '5px 10px', borderRadius: '5px', color: '#fff' }}>
                  {option.title}
                </span>
              </li>
            ))}
          </ul>
          <h3>パスワードの説明:</h3>
          <p>予約を作成する際には、パスワードを設定してください。予約を削除するには、同じパスワードを使用する必要があります。管理者パスワードを使用すると、すべての予約を削除できます。</p>
        </div>
      )}
    </div>
  );
};

export default BigCalendarComponent;
