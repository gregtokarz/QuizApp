import * as React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {ResultTable} from '../components/ResultTable';
import {useEffect, useState} from 'react';

export const ResultScreen = () => {
  const [data, setData] = useState(null);

  const getResults = async () => {
    try {
      const response = await fetch('https://tgryl.pl/quiz/results');
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      //setLoading(false);
    }
  };

  useEffect(() => {
    getResults();
  }, []);

  const item = ({item}) => {
    return (
      <View style={{flexDirection: 'row'}}>
        <View style={styles.tablewidth}>
          <Text style={styles.row}>{item.nick}</Text>
        </View>
        <View style={styles.tablewidth}>
          <Text style={styles.row}>
            {item.score}/{item.total}
          </Text>
        </View>
        <View style={styles.tablewidth}>
          <Text style={styles.row}>{item.type}</Text>
        </View>
      </View>
    );
  };

  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);
  return (
    <View
      style={{
        flex: 1,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 20,
      }}>
      <View style={{flexDirection: 'row'}}>
        <View style={styles.tablewidth}>
          <Text style={styles.title}>Nick</Text>
        </View>
        <View style={styles.tablewidth}>
          <Text style={styles.title}>Punkty</Text>
        </View>
        <View style={styles.tablewidth}>
          <Text style={styles.title}>Typ</Text>
        </View>
      </View>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        data={data}
        renderItem={item}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    padding: 5,
    color: '#211f1f',
    backgroundColor: '#fd8838',
    fontWeight: 'bold',
    borderWidth: 1,
    textAlign: 'center',
  },
  row: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
    padding: 6,
    borderWidth: 1,
  },
  tablewidth: {
    width: 130,
  },
});
