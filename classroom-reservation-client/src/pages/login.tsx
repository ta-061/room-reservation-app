import { useState } from 'react';
import { useRouter } from 'next/router';

const LoginPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/v1/authenticate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        const timestamp = new Date().getTime();
        sessionStorage.setItem('password', password);
        sessionStorage.setItem('timestamp', timestamp.toString());
        router.push('/calendar');
      } else {
        setError('合言葉が正しくありません');
      }
    } catch (error) {
      setError('認証に失敗しました');
    }
  };

  return (
    <div className="container">
      <h1>ログイン</h1>
      <form onSubmit={handlePasswordSubmit}>
        <div>
          <label>合言葉を入力してください:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">送信</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default LoginPage;
