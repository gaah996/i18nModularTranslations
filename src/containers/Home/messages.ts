import {namespacedMessages} from '../../utils/translations';

export default namespacedMessages('Home')({
  add: {
    id: 'add',
    message: 'Add new',
    description: 'Button to add new to-do',
  },
  removeAll: {
    id: 'removeAll',
    message: 'Delete all',
    description: 'Button to remove all to-dos',
  },
  removeAllAlert: {
    id: 'removeAllAlert',
    message: 'Are you sure you want to remove all tasks?',
  },
  pendingTasks: {
    id: 'pendingTasks',
    message: {
      one: 'You have {{count}} pending task',
      other: 'You have {{count}} pending tasks',
    },
  },
});
