import * as React from 'react';
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  Alert,
} from 'react-native';
import {useEffect, useState} from 'react';
import {shuffle} from 'lodash';
import NetInfo from '@react-native-community/netinfo';
import Sqlite from 'react-native-sqlite-storage';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import {Quiz} from '../navigation/MyDrawer';
export const HomeScreen = ({navigation}) => {
  const [data, setData] = useState(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const route = useRoute();

  const item = ({item}) => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Test', {keyParams: item.id})}
          style={{
            width: '99%',
            marginLeft: 'auto',
            marginRight: 'auto',
            borderWidth: 5,
            borderColor: '#1E90FF',
            backgroundColor: '#4687ff',
            borderRadius: 5,
            paddingHorizontal: 20,
            marginVertical: 3,
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontFamily: 'AlfaSlabOne-Regular',
              fontSize: 30,
              color: 'white',
              padding: 20,
            }}>
            {item.name}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <FlatList
        style={{marginTop: 10}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        data={Quiz}
        renderItem={item}
        keyExtractor={(item, index) => index.toString()}
      />

      <View style={{width: '100%', marginTop: 10}}>
        <Button
          title="Pokaz wyniki"
          onPress={() => navigation.navigate('Result')}
        />
      </View>
    </View>
  );
};
