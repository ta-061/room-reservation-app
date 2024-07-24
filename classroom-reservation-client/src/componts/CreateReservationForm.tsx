import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';

interface CreateReservationFormProps {
  selectedSlot: { start: Date, end: Date, resourceId: number } | null;
  refreshReservations: () => void;
}

const classroomOptions = [
  { id: 1, title: '実験室221', color: '#f56c6c' },
  { id: 2, title: 'ゼミ室222', color: '#e6a23c' },
  { id: 3, title: '実験室231', color: '#5cb87a' },
  { id: 4, title: '演習室241', color: '#409eff' },
  { id: 5, title: 'PBL室242', color: '#d87cdd' }
];

const CreateReservationForm: React.FC<CreateReservationFormProps> = ({ selectedSlot, refreshReservations }) => {
  const [formData, setFormData] = useState({
    user_name: '',
    classroom_id: selectedSlot ? selectedSlot.resourceId : 1,
    classroom_name: classroomOptions.find(option => option.id === (selectedSlot ? selectedSlot.resourceId : 1))?.title || '',
    start_time: '',
    end_time: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedSlot) {
      const localStartTime = moment(selectedSlot.start).local().format('YYYY-MM-DDTHH:mm');
      const localEndTime = moment(selectedSlot.end).local().format('YYYY-MM-DDTHH:mm');
      setFormData(prev => ({
        ...prev,
        start_time: localStartTime,
        end_time: localEndTime,
        classroom_id: selectedSlot.resourceId,
        classroom_name: classroomOptions.find(option => option.id === selectedSlot.resourceId)?.title || ''
      }));
    }
  }, [selectedSlot]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'classroom_id' && {
        classroom_name: classroomOptions.find(option => option.id === parseInt(value))?.title
      })
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.user_name.trim() || !formData.password.trim()) {
      setError('予約者名とパスワードを入力してください。');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reservation: formData })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Network response was not ok');
      }
      refreshReservations();
      setError(null); // エラーをクリア
    } catch (error) {
      console.error('Failed to create reservation:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('予約の作成に失敗しました。');
      }
    }
  };

  return (
    selectedSlot && (
      <div className="form-container">
        <h2>新しい予約を作成する</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>
            予約者名:
            <input type="text" name="user_name" value={formData.user_name} onChange={handleChange} />
          </label>
          <label>
            教室名:
            <select name="classroom_id" value={formData.classroom_id} onChange={handleChange}>
              {classroomOptions.map(option => (
                <option key={option.id} value={option.id}>{option.title}</option>
              ))}
            </select>
          </label>
          <label>
            利用開始時刻:
            <input type="datetime-local" name="start_time" value={formData.start_time} onChange={handleChange} />
          </label>
          <label>
            利用終了時刻:
            <input type="datetime-local" name="end_time" value={formData.end_time} onChange={handleChange} />
          </label>
          <label>
            パスワード:
            <input type="password" name="password" value={formData.password} onChange={handleChange} />
          </label>
          <button type="submit">予約する</button>
        </form>
      </div>
    )
  );
};

export default CreateReservationForm;
