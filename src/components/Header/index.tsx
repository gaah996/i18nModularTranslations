import React, {useState} from 'react';
import {View, Text, Alert} from 'react-native';

import {t} from '../../utils/translations';
import LanguageSelector, {LanguageSelectorProps} from '../LanguageSelector';
import messages from './messages';
import styles from './styles';

const Header = (languageProps: LanguageSelectorProps): JSX.Element => {
  const [name, setName] = useState<string | undefined>();

  const handleSetName = () => {
    Alert.prompt(t(messages.name), undefined, (text: string) => {
      setName(text);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {name ? (
          <>
            {t(messages.welcome)} <Text style={styles.boldTitle}>{name}</Text>
          </>
        ) : (
          <Text onPress={handleSetName}>{t(messages.helloWorld)}</Text>
        )}
      </Text>
      <LanguageSelector {...languageProps} />
    </View>
  );
};

export default Header;
