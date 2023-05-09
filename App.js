import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {MyDrawer} from './navigation/MyDrawer';
import SplashScreen from 'react-native-splash-screen';
import {AsyncStorage} from 'react-native';
export let value;
/* eslint-disable */
function App() {
  React.useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <NavigationContainer>
      <MyDrawer />
    </NavigationContainer>
  );
}

export default App;
