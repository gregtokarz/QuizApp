import * as React from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  AsyncStorage,
  ActivityIndicator,
  Button,
  TouchableOpacity,
} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  useDrawerStatus,
} from '@react-navigation/drawer';
import {HomeScreen} from '../screens/HomeScreen';
import {ResultScreen} from '../screens/ResultScreen';
import {Rules} from '../screens/Rules';
import {TestScreen} from '../screens/TestScreen';
import {useEffect, useState} from 'react';
import {shuffle} from 'lodash';
import Sqlite from 'react-native-sqlite-storage';
import NetInfo from '@react-native-community/netinfo';
import {useNavigation} from '@react-navigation/native';

const Drawer = createDrawerNavigator();
export let Quiz;
function CustomDrawerContent(props) {
        const [isLoading, setIsLoading] = useState(true);
  const refreshTest = () => {
    const getTests = async () => {
      try {
        const response = await fetch('https://tgryl.pl/quiz/tests');
        const json = await response.json();
        Quiz = shuffle(json);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    getTests();
    if (isLoading) {
      return <ActivityIndicator />;
    } else {
      props.navigation.navigate('Home');
    }
  };
  return (
    <DrawerContentScrollView {...props}>
      <Text
        style={{
          fontSize: 50,
          textAlign: 'center',
          fontWeight: 'bold',
          color: 'blue',
        }}>
        QuizApp
      </Text>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Image
          source={require('../img/quiz.png')}
          style={{height: 200, width: 200}}
        />
      </View>
      <Button title="Pobierz najnowsze testy" onPress={refreshTest} />
      <Text style={{textAlign: 'center', color: '#ee29ff', fontSize: 25, fontWeight: 'bold'}}>Testy</Text>
      {Quiz?.map(r => {
        return (
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate('Test', {keyParams: r.id})
            }>
            <Text style={{textAlign: 'center', color: '#2c48ff', fontWeight: 'bold'}}>{r.name}</Text>
          </TouchableOpacity>
        );
      })}
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

const db = Sqlite.openDatabase(
  {name: 'Quiz.db', createFromLocation: 1},
  () => {
    console.log('Database OPENED');
  },
  err => {
    console.log('SQL Error: ' + err);
  },
);

export const MyDrawer = navigation => {
  let async = false;
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState(false);
  const [isConnection, setIsConnection] = useState(false);
  const [Quest, setQuest] = useState([]);
  const [Quest2, setQuest2] = useState([]);
  let ndata;

  useEffect(() => {
    getTests();
  }, []);

  //sprawdzenie czy jest polaczenie z internetem
  const getNetInfo = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected === false) {
      }
    });
  };
  const getTests = async () => {
    try {
      const response = await fetch('https://tgryl.pl/quiz/tests');
      const json = await response.json();
      Quiz = shuffle(json);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  const getQuest2 = async () => {
    for (let i = 0; i < Quest.length; i++) {
      try {
        const response = await fetch(
          'https://tgryl.pl/quiz/test/' + Quest[i].id,
        );
        const json = await response.json();
        setQuest2(current => [...current, JSON.stringify(json)]);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
        console.log('dlugosc ' + Quest2.length);
      }
    }
  };

  const createTables = () => {
    db.transaction(txn => {
      txn.executeSql(
        'CREATE TABLE IF NOT EXISTS ' +
          'QUIZ' +
          ' (id INTEGER PRIMARY KEY AUTOINCREMENT, Question TEXT, Answer TEXT, isCorrect BOOLEAN, Answer TEXT, isCorrect BOOLEAN, Answer TEXT, isCorrect BOOLEAN, Answer TEXT, isCorrect BOOLEAN);' +
          'CREATE TABLE IF NOT EXISTS ' +
          'QUIZ2' +
          ' (id TEXT, name TEXT);',
        [],
        (sqlTxn, res) => {
          console.log('table created successfully');
        },
        error => {
          console.log('error on creating table ' + error.message);
        },
      );
    });
  };

  const addData = () => {
    db.transaction(txn => {
      txn.executeSql(
        'INSERT INTO QUIZ (Question, Answer, isCorrect, Answer, isCorrect, Answer, isCorrect, Answer, isCorrect) VALUES(Question2[i].tasks.question,"coss")',
        [],
        (sqlTxn, res) => {
          console.log('table created successfully');
        },
        error => {
          console.log('error on creating table ' + error.message);
        },
      );
    });
  };

  if (isLoading) {
    return <ActivityIndicator />;
  } else {
    return (
      <Drawer.Navigator
        initialRouteName={'Rules'}
        drawerContent={props => <CustomDrawerContent {...props} />}
        useLegacyImplementation>
        <Drawer.Screen
          name="Home"
          component={HomeScreen}
          options={{
            drawerItemStyle: {height: 0},
          }}
        />
        <Drawer.Screen name="Result" component={ResultScreen} />
        <Drawer.Screen
          name="Rules"
          component={Rules}
          options={{
            drawerItemStyle: {height: 0},
          }}
        />

        <Drawer.Screen
          name="Test"
          component={TestScreen}
          options={{
            drawerItemStyle: {height: 0},
          }}
        />
      </Drawer.Navigator>
    );
  }
};
