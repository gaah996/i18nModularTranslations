import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {t} from '../../utils/translations';
import messages from './messages';
import taskCommonMessages from '../../common/task.messages';
import styles from './styles';
import {Task} from '../../models/Task';

interface TaskProps {
  task: Task;
  language?: string;
  onComplete: () => void;
  onRemove: () => void;
}

const TaskComponent = ({
  task,
  language = 'en',
  onComplete,
  onRemove,
}: TaskProps): JSX.Element => {
  return (
    <View style={styles.container}>
      <View style={styles.taskTextContainer}>
        <Text
          style={[
            styles.taskText,
            task.completedAt ? styles.taskCompleted : undefined,
          ]}>
          {task.text}
        </Text>
      </View>
      <Text style={styles.taskInfo}>{`${t(messages.priority)} ${t(
        taskCommonMessages[task.priority],
      )}`}</Text>
      <Text style={styles.taskInfo}>
        {t(messages.createdAt, {date: task.createdAt.toLocaleString(language)})}
      </Text>
      {!!task.completedAt && (
        <Text style={styles.taskInfo}>
          {t(messages.completedAt, {
            date: task.completedAt.toLocaleString(language),
          })}
        </Text>
      )}
      <View style={styles.actionsContainer}>
        {!task.completedAt && (
          <TouchableOpacity style={styles.actionWrapper} onPress={onComplete}>
            <Text style={styles.actionText}>{t(messages.doneAction)}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.actionWrapper} onPress={onRemove}>
          <Text style={styles.actionText}>{t(messages.removeAction)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TaskComponent;
