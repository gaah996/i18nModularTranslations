import React from 'react';
import {Text, SafeAreaView} from 'react-native';
import {t} from '../../utils/translations';
import messages from './messages';

const Home = (): JSX.Element => {
  return (
    <SafeAreaView>
      <Text>{t(messages.helloWorld)}</Text>
    </SafeAreaView>
  );
};

export default Home;
