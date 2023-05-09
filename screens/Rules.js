import * as React from 'react';
import {View, Text, Button, ActivityIndicator} from 'react-native';
import {AsyncStorage} from 'react-native';
import {useEffect, useState} from 'react';

export const Rules = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [values, setValue] = useState(false);

  useEffect(() => {
    retrieveData();
  }, []);
  const storeData = async () => {
    try {
      await AsyncStorage.setItem('Rulesss', 'true');
    } catch (error) {
      // Error saving data
    } finally {
      navigation.navigate('Home');
    }
  };
  const retrieveData = async () => {
    try {
      setValue(await AsyncStorage.getItem('Rulesss'));
    } catch (error) {
      // Error retrieving data
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <ActivityIndicator />;
  } else {
    if (values) {
      navigation.navigate('Home');
    } else {
      return (
        <View>
          <View>
            <Text
              style={{fontSize: 30, textAlign: 'center', fontWeight: 'bold'}}>
              Regulamin aplikacji
            </Text>
            <Text
              style={{fontSize: 20, textAlign: 'center', fontWeight: 'bold'}}>
              Zanim klikniesz którykolwiek przycisk prosimy o przeczytanie do
              końca tej informacji – dotyczy ona Twoich danych osobowych.
              Klikając „Akceptuję” udzielasz zgody na przetwarzanie Twoich
              danych osobowych dotyczących Twojej aktywności w Internecie (np.
              identyfikatory urządzenia, adres IP)
            </Text>
          </View>
          <Button title={'Akceptuje'} onPress={storeData} />
        </View>
      );
    }
  }
};
