import * as React from 'react';
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import {useEffect, useState} from 'react';
import {useRoute} from '@react-navigation/native';
import {shuffle} from 'lodash';

export const TestScreen = ({navigation}) => {
  const [Quest, setQuest] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentOptionSelected, setCurrentOptionSelected] = useState(null);
  const [correctOption, setCorrectOption] = useState(null);
  const [isOptionDisabled, setIsOptionDisabled] = useState(false);
  const [score, setScore] = useState(0);
  const [showNextButton, setShowNextButton] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);

  const route = useRoute();
  const [refreshing, setRefreshing] = React.useState(false);
  //odświeżanie widoku poprzez pull on refresh
  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    wait(2000).then(() => setRefreshing(false));
  }, []);
  // pobierz dane z serwera
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getQuest = async () => {
    try {
      const response = await fetch(
        'https://tgryl.pl/quiz/test/' + route.params.keyParams,
      );
      const json = await response.json();
      setQuest(shuffle(json.tasks));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  // wyslij dane na serwer
  const sendResult = () => {
    fetch('https://tgryl.pl/quiz/result?last=5', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nick: 'Ja',
        score: score,
        total: Quest.length,
        type: 'historia',
      }),
    });
  };

  useEffect(() => {
    const focusHandler = navigation.addListener('focus', () => {
      getQuest();
    });
    return focusHandler;
  }, [getQuest, navigation]);

  const validateAnswer = selectedOption => {
    let correct_answer;
    for (let i = 0; i < 4; i++) {
      if (Quest[currentQuestionIndex].answers[i].isCorrect) {
        correct_answer = Quest[currentQuestionIndex].answers[i].content;
      }
    }
    setCurrentOptionSelected(selectedOption);
    setCorrectOption(correct_answer);
    setIsOptionDisabled(true);

    if (selectedOption == correct_answer) {
      setScore(score + 1);
    }
    setShowNextButton(true);
  };

  const restartQuiz = () => {
    setShowScoreModal(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setCurrentOptionSelected(null);
    setCorrectOption(null);
    setIsOptionDisabled(false);
    setShowNextButton(false);
  };

  const renderQuestion = () => {
    return (
      <View>
        <View style={{flexDirection: 'row'}}>
          <Text
            style={{
              color: 'white',
              fontSize: 20,
              opacity: 0.6,
              marginRight: 2,
            }}>
            {currentQuestionIndex + 1}
          </Text>
          <Text style={{color: 'white', fontSize: 18, opacity: 0.6}}>
            / {Quest.length}
          </Text>
        </View>
        <Text
          style={{
            fontFamily: 'Vollkorn-VariableFont_wght',
            fontSize: 25,
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
          }}>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            Quest[currentQuestionIndex]?.question
          )}
        </Text>
      </View>
    );
  };

  const renderOptions = () => {
    return (
      <View>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          Quest[currentQuestionIndex]?.answers.map(option => (
            <TouchableOpacity
              onPress={() => validateAnswer(option.content)}
              key={option.content}
              disabled={isOptionDisabled}
              style={{
                borderWidth: 3,
                borderColor:
                  option.content == correctOption
                    ? '#61fc0f'
                    : option.content == currentOptionSelected
                    ? '#fd0f0f'
                    : '#015ab6',
                backgroundColor: '#4687ff',
                height: 60,
                borderRadius: 20,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
                marginVertical: 8,
              }}>
              <Text
                style={{
                  fontSize: 20,
                  color: '#ffffff',
                  marginLeft: 15,
                  fontWeight: 'bold',
                }}>
                {option.content}
              </Text>
              {option.content == correctOption ? (
                <View
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 30 / 2,
                    backgroundColor: 'green',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                />
              ) : option.content == currentOptionSelected ? (
                <View
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 30 / 2,
                    backgroundColor: 'red',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                />
              ) : null}
            </TouchableOpacity>
          ))
        )}
      </View>
    );
  };

  const handleNext = () => {
    if (currentQuestionIndex == Quest.length - 1) {
      setShowScoreModal(true);
      //sendResult();
    } else {
      setIsOptionDisabled(false);
      setShowNextButton(false);
      setCorrectOption(null);
      setCurrentOptionSelected(null);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const renderNextButton = () => {
    if (showNextButton) {
      return (
        <TouchableOpacity
          onPress={handleNext}
          style={{
            marginTop: 20,
            width: '100%',
            backgroundColor: '#19b0de',
            padding: 20,
            borderRadius: 5,
          }}>
          <Text style={{fontSize: 20, color: '#ffffff', textAlign: 'center'}}>
            Next
          </Text>
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  };
  return (
    <ScrollView
      style={{backgroundColor: '#252C4A', width: '100%', height: '100%'}}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {renderQuestion()}
      {renderOptions()}
      {renderNextButton()}
      <Modal animationType="slide" transparent={true} visible={showScoreModal}>
        <View
          style={{
            flex: 1,
            backgroundColor: '#0360af',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              backgroundColor: '#ffffff',
              width: '90%',
              borderRadius: 20,
              padding: 20,
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 30, fontWeight: 'bold'}}>
              {score > Quest.length / 2 ? 'Gratulacje' : 'Upsss!'}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginVertical: 20,
              }}>
              <Text
                style={{
                  fontSize: 30,
                  color: score > Quest.length / 2 ? '#1f7204' : '#ad0707',
                }}>
                {score}
              </Text>
              <Text
                style={{
                  fontSize: 20,
                  color: '#070707',
                }}>
                / {Quest.length}
              </Text>
            </View>
            {/* Retry Quiz button */}
            <TouchableOpacity
              onPress={restartQuiz}
              style={{
                backgroundColor: '#173e9a',
                padding: 20,
                width: '100%',
                borderRadius: 20,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: '#ffffff',
                  fontSize: 20,
                }}>
                Zrestartuj Quiz
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};
