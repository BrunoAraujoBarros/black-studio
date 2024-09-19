import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Main } from './components/main';

export default function App() {
  const [isFontLoaded] = useFonts({
      'GeneralSans-400': require('./src/assents/fonts/GeneralSans-Regular.otf'),
      'GeneralSans-600': require('./src/assents/fonts/GeneralSans-Semibold.otf'),
      'GeneralSans-700': require('./src/assents/fonts/GeneralSans-Bold.otf')
  });
  
  if(!isFontLoaded){
      return null
  }


  return(
    <>
      <StatusBar />
      <Main />
    </>
  )
}