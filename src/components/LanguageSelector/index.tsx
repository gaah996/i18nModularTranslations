import React, {useState} from 'react';
import {availableLanguages} from '../../App';
import {
  Modal,
  TouchableOpacity,
  Text,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import styles from './styles';
import messages from './messages';
import {t} from '../../utils/translations';

export interface LanguageOption {
  label: string;
  value: string;
}

export interface LanguageSelectorProps {
  selectedLanguage: string;
  onSelectLanguage: (language: string) => void;
}

const LanguageSelector = ({
  selectedLanguage,
  onSelectLanguage,
}: LanguageSelectorProps): JSX.Element => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleOpenPicker = () => {
    setShowModal(true);
  };

  const handleClosePicker = () => {
    setShowModal(false);
  };

  const handleSelectLanguage = (language: string) => () => {
    handleClosePicker();
    onSelectLanguage(language);
  };

  return (
    <>
      <TouchableOpacity onPress={handleOpenPicker}>
        <Text style={styles.languageText}>
          {
            availableLanguages.find(
              language => language.value === selectedLanguage,
            )?.label
          }
        </Text>
      </TouchableOpacity>
      <Modal animationType="slide" visible={showModal} transparent>
        <TouchableWithoutFeedback onPress={handleClosePicker}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{t(messages.modalTitle)}</Text>
                <View style={styles.optionsContainer}>
                  {availableLanguages.map(language => (
                    <TouchableOpacity
                      key={language.value}
                      onPress={handleSelectLanguage(language.value)}>
                      <View style={styles.languageItem}>
                        <Text style={styles.languageItemText}>
                          {language.label}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export default LanguageSelector;
