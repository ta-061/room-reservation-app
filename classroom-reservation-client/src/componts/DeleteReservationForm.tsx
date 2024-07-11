import React, { useState } from 'react';
import moment from 'moment-timezone';

interface DeleteReservationFormProps {
  reservationId: number;
  reservationDetails: {
    user_name: string;
    classroom_name: string;
    start_time: string;
    end_time: string;
  };
  refreshReservations: () => void;
}

const DeleteReservationForm: React.FC<DeleteReservationFormProps> = ({ reservationId, reservationDetails, refreshReservations }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const formatDateTime = (dateTime: string) => {
    return moment(dateTime).tz('Asia/Tokyo').format('M月D日 HH:mm');
  };

  const handleDelete = async () => {
    if (!password.trim()) {
      setError('パスワードを入力してください。');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/reservations/${reservationId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      });

      if (!response.ok) {
        if (response.status === 401) { // 仮に401エラーをパスワード不一致とする
          setError('パスワードが異なります。');
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Network response was not ok');
        }
        return;
      }

      refreshReservations();
      setError(null); // 正常に削除できた場合、エラーをクリア
    } catch (error) {
      console.error('Failed to delete reservation:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('予約の削除に失敗しました。');
      }
    }
  };

  return (
    <div className="form-container">
      <h2>予約の削除</h2>
      {error && <p className="error-message">{error}</p>}
      <p>予約者名: {reservationDetails.user_name}</p>
      <p>教室名: {reservationDetails.classroom_name}</p>
      <p>利用開始時刻: {formatDateTime(reservationDetails.start_time)}</p>
      <p>利用終了時刻: {formatDateTime(reservationDetails.end_time)}</p>
      <label>
        パスワード:
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </label>
      <button onClick={handleDelete}>削除する</button>
    </div>
  );
};

export default DeleteReservationForm;
