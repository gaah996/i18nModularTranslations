import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  languageText: {
    fontSize: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    paddingTop: 30,
    paddingBottom: 50,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  languageItem: {
    marginHorizontal: 15,
  },
  languageItemText: {
    fontSize: 30,
  },
});
