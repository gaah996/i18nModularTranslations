import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    backgroundColor: '#EEE',
    flex: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
  actionWrapper: {
    marginHorizontal: 5,
    marginVertical: 5,
    backgroundColor: '#884EA0',
    borderRadius: 5,
    padding: 8,
    alignSelf: 'flex-start',
  },
  actionText: {
    color: 'white',
  },
  actionSmallText: {
    fontSize: 10,
  },
  infoContainer: {
    padding: 20,
    paddingBottom: 10,
  },
  tasksContainer: {
    padding: 20,
    paddingTop: 10,
  },
});
