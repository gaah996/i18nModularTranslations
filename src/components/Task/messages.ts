import {namespacedMessages} from '../../utils/translations';

export default namespacedMessages('Task')({
  createdAt: {
    id: 'createdAt',
    message: 'Created on {{date}}',
    description: 'Date when task was created',
  },
  completedAt: {
    id: 'completedAt',
    message: 'Finished on {{date}}',
    description: 'Date when task was finished',
  },
  doneAction: {
    id: 'actions.done',
    message: 'Mark as done',
  },
  removeAction: {
    id: 'actions.remove',
    message: 'Delete',
  },
});
