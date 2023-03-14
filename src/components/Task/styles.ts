import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    shadowColor: '#CCC',
    shadowRadius: 5,
    shadowOpacity: 1,
    shadowOffset: {width: 0, height: 2},
    marginBottom: 20,
  },
  taskTextContainer: {
    borderBottomColor: '#CCC',
    borderBottomWidth: 1,
  },
  taskText: {
    fontSize: 16,
    paddingBottom: 10,
  },
  taskCompleted: {
    textDecorationLine: 'line-through',
    color: '#555',
  },
  taskInfo: {
    color: 'grey',
    fontSize: 12,
    paddingTop: 5,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 20,
  },
  actionWrapper: {
    marginLeft: 20,
  },
  actionText: {
    textDecorationLine: 'underline',
  },
});
