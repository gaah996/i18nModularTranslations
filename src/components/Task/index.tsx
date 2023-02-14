import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {t} from '../../utils/translations';
import messages from './messages';
import styles from './styles';

interface TaskProps {
  text: string;
  createdAt: Date;
  completedAt?: Date;
}

const Task = ({text, createdAt, completedAt}: TaskProps): JSX.Element => {
  return (
    <View style={styles.container}>
      <View style={styles.taskTextContainer}>
        <Text
          style={[
            styles.taskText,
            completedAt ? styles.taskCompleted : undefined,
          ]}>
          {text}
        </Text>
      </View>
      <Text style={styles.taskDate}>
        {t(messages.createdAt, {date: createdAt.toLocaleString()})}
      </Text>
      {!!completedAt && (
        <Text style={styles.taskDate}>
          {t(messages.completedAt, {date: completedAt.toLocaleString()})}
        </Text>
      )}
      <View style={styles.actionsContainer}>
        {!completedAt && (
          <TouchableOpacity style={styles.actionWrapper}>
            <Text style={styles.actionText}>{t(messages.doneAction)}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.actionWrapper}>
          <Text style={styles.actionText}>{t(messages.removeAction)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Task;
