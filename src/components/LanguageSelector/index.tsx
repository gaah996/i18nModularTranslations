import React, {useState} from 'react';
import {availableLanguages} from '../../App';
import {Modal, TouchableOpacity, Text, View} from 'react-native';
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

  const handleSelectLanguage = (language: string) => () => {
    setShowModal(false);
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
        <View style={styles.modalContainer}>
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
        </View>
      </Modal>
    </>
  );
};

export default LanguageSelector;
