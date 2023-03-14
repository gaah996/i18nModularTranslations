import {TaskPriority} from '../models/Task';
import {namespacedMessages} from '../utils/translations';

export default namespacedMessages('Common.Task')({
  [TaskPriority.Low]: {
    id: `priority.${TaskPriority.Low}`,
    message: 'Low',
    description: 'Task priority shown in the add button',
  },
  [TaskPriority.Medium]: {
    id: `priority.${TaskPriority.Medium}`,
    message: 'Medium',
    description: 'Task priority shown in the add button',
  },
  [TaskPriority.High]: {
    id: `priority.${TaskPriority.High}`,
    message: 'High',
    description: 'Task priority shown in the add button',
  },
});
