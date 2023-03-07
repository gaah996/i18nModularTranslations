import path from 'path';

export default {
  rootDirPath: path.join(process.env.PWD ?? '', 'src'),
  translationsDirPath: path.join(process.env.PWD ?? '', 'src', 'translations'),
  termsFilePath: path.join(
    process.env.PWD ?? '',
    'src',
    'translations',
    'terms.json',
  ),

  messagesFilesRegex: /(messages.[tj]sx?)$/,

  availableLanguages: ['en', 'pt'],
  defaultLanguage: 'en',
};
