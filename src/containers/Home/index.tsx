import React from 'react';
import {
  Text,
  SafeAreaView,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import Header from '../../components/Header';
import Task from '../../components/Task';
import {t} from '../../utils/translations';
import messages from './messages';
import styles from './styles';

const Home = (): JSX.Element => {
  return (
    <SafeAreaView style={styles.container}>
      <Header name={'Gabriel'} />
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionWrapper}>
          <Text style={styles.actionText}>{t(messages.add)}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionWrapper}>
          <Text style={styles.actionText}>{t(messages.removeAll)}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.tasksContainer}>
        <Task text={'Go to the supermarket'} createdAt={new Date()} />
        <Task
          text={'Go to the supermarket'}
          createdAt={new Date()}
          completedAt={new Date()}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
