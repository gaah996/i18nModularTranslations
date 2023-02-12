import React from 'react';
import {Text, SafeAreaView} from 'react-native';
import {t} from 'i18next';

const Home = (): JSX.Element => {
  return (
    <SafeAreaView>
      <Text>{t('helloWorld')}</Text>
    </SafeAreaView>
  );
};

export default Home;
