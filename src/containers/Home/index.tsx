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
import TaskComponent from '../../components/Task';
import {t} from '../../utils/translations';
import messages from './messages';
import commonMessages from '../../common/messages';
import taskCommonMessages from '../../common/task.messages';
import styles from './styles';
import {LanguageSelectorProps} from '../../components/LanguageSelector';
import {Task, TaskPriority} from '../../models/Task';

const Home = (languageProps: LanguageSelectorProps): JSX.Element => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      text: 'Go to the supermarket',
      priority: TaskPriority.Low,
      createdAt: new Date(),
      completedAt: undefined,
    },
    {
      text: 'Finish project',
      priority: TaskPriority.High,
      createdAt: new Date(),
      completedAt: undefined,
    },
  ]);

  const pendingTasks: number = useMemo(
    () => tasks.filter(task => !task.completedAt).length,
    [tasks],
  );

  const handleAddTask = (priority: TaskPriority) => () => {
    Alert.prompt(t(messages.add), undefined, [
      {text: t(commonMessages.cancel)},
      {
        text: t(commonMessages.ok),
        onPress: (text: string | undefined) => {
          if (!text) {
            return;
          }

          setTasks([
            {text, priority, createdAt: new Date(), completedAt: undefined},
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
        <TouchableOpacity
          style={styles.actionWrapper}
          onPress={handleAddTask(TaskPriority.Low)}>
          <Text style={styles.actionText}>
            {t(messages.add)}
            <Text style={styles.actionSmallText}>
              {` (${t(taskCommonMessages[TaskPriority.Low])})`}
            </Text>
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionWrapper}
          onPress={handleAddTask(TaskPriority.Medium)}>
          <Text style={styles.actionText}>
            {t(messages.add)}
            <Text style={styles.actionSmallText}>
              {` (${t(taskCommonMessages[TaskPriority.Medium])})`}
            </Text>
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionWrapper}
          onPress={handleAddTask(TaskPriority.High)}>
          <Text style={styles.actionText}>
            {t(messages.add)}
            <Text style={styles.actionSmallText}>
              {` (${t(taskCommonMessages[TaskPriority.High])})`}
            </Text>
          </Text>
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
          <TaskComponent
            key={index}
            task={task}
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
