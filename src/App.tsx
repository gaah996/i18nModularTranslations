import 'intl-pluralrules';

import i18next from 'i18next';
import React, {FC} from 'react';

import en from './translations/en.json';

import Home from './containers/Home';

i18next.init({
  lng: 'en',
  keySeparator: false,
  resources: {
    en: {translation: en},
  },
  interpolation: {
    escapeValue: false,
  },
});

const App: FC = () => {
  return <Home />;
};

export default App;
