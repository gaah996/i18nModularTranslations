import React from 'react';
import {View, Text} from 'react-native';

import {t} from '../../utils/translations';
import messages from './messages';
import styles from './styles';

interface HeaderProps {
  name?: string;
}

const Header = ({name}: HeaderProps): JSX.Element => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {name ? (
          <>
            {t(messages.welcome)} <Text style={styles.boldTitle}>{name}</Text>
          </>
        ) : (
          t(messages.helloWorld)
        )}
      </Text>
    </View>
  );
};

export default Header;
