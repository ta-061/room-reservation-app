import '../styles/globals.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
