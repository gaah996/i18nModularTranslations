import React, {useMemo, useState} from 'react';
import {
  Text,
  SafeAreaView,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
} from 'react-native';
import Header from '../../components/Header';
import Task from '../../components/Task';
import {t} from '../../utils/translations';
import messages from './messages';
import commonMessages from '../../common/messages';
import styles from './styles';
import {LanguageSelectorProps} from '../../components/LanguageSelector';

interface Task {
  text: string;
  createdAt: Date;
  completedAt: Date | undefined;
}

const Home = (languageProps: LanguageSelectorProps): JSX.Element => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      text: 'Go to the supermarket',
      createdAt: new Date(),
      completedAt: undefined,
    },
    {text: 'Finish project', createdAt: new Date(), completedAt: undefined},
  ]);

  const pendingTasks: number = useMemo(
    () => tasks.filter(task => !task.completedAt).length,
    [tasks],
  );

  const handleAddTask = () => {
    Alert.prompt(t(messages.add), undefined, [
      {text: t(commonMessages.cancel)},
      {
        text: t(commonMessages.ok),
        onPress: (text: string | undefined) => {
          if (!text) {
            return;
          }

          setTasks([
            {text: text ?? '', createdAt: new Date(), completedAt: undefined},
            ...tasks,
          ]);
        },
      },
    ]);
  };

  const handleRemoveAllTasks = () => {
    Alert.alert(t(messages.removeAll), t(messages.removeAllAlert), [
      {text: t(commonMessages.cancel)},
      {
        text: t(commonMessages.ok),
        onPress: () => {
          setTasks([]);
        },
      },
    ]);
  };

  const handleCompleteTask = (clickedIndex: number) => () => {
    const newTasks = tasks.map((task, index) => ({
      ...task,
      completedAt: index === clickedIndex ? new Date() : task.completedAt,
    }));

    setTasks(newTasks);
  };

  const handleRemoveTask = (index: number) => () => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);

    setTasks(newTasks);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header {...languageProps} />
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionWrapper} onPress={handleAddTask}>
          <Text style={styles.actionText}>{t(messages.add)}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionWrapper}
          onPress={handleRemoveAllTasks}>
          <Text style={styles.actionText}>{t(messages.removeAll)}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.infoContainer}>
        <Text>{t(messages.pendingTasks, {count: pendingTasks})}</Text>
      </View>
      <ScrollView style={styles.tasksContainer}>
        {tasks.map((task, index) => (
          <Task
            key={index}
            text={task.text}
            createdAt={task.createdAt}
            completedAt={task.completedAt}
            language={languageProps.selectedLanguage}
            onComplete={handleCompleteTask(index)}
            onRemove={handleRemoveTask(index)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
