import 'intl-pluralrules';

import i18next from 'i18next';
import React, {FC, useEffect, useState} from 'react';

import en from './translations/en.json';
import pt from './translations/pt.json';

import Home from './containers/Home';
import {LanguageOption} from './components/LanguageSelector';

i18next.init({
  lng: 'en',
  // fallbackLng: 'en',
  keySeparator: false,
  resources: {
    en: {translation: en},
    pt: {translation: pt},
  },
  interpolation: {
    escapeValue: false,
  },
});

export const availableLanguages: LanguageOption[] = [
  {label: '🇬🇧', value: 'en'},
  {label: '🇩🇪', value: 'de'},
  {label: '🇧🇷', value: 'pt'},
];

const App: FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [_, updateScreen] = useState<string>('en');

  useEffect(() => {
    i18next.changeLanguage(selectedLanguage);
    setTimeout(() => {
      updateScreen(selectedLanguage);
    }, 0);
  }, [selectedLanguage]);

  return (
    <Home
      selectedLanguage={selectedLanguage}
      onSelectLanguage={setSelectedLanguage}
    />
  );
};

export default App;
