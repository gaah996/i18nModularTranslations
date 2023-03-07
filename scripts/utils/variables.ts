import path from 'path';

export default {
  // Extract terms variables
  rootDirPath: path.join(process.env.PWD ?? '', 'src'),
  messagesFilesRegex: /(messages.[tj]sx?)$/,
  termsFilePath: path.join(
    process.env.PWD ?? '',
    'src',
    'translations',
    'terms.json',
  ),
};
