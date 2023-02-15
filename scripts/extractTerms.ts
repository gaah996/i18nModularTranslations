import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

import variables from './variables';

type TraslationQuantifier = 'zero' | 'one' | 'two' | 'few' | 'many' | 'other';

interface TranslationMessage {
  id: string;
  message: string | Partial<Record<TraslationQuantifier, string>>;
  description?: string;
}

function scanFilesDeep(dirPath: string): string[] {
  let scannedContent: string[] = [];
  const dirContents = fs
    .readdirSync(dirPath)
    .map(item => path.join(dirPath, item));

  dirContents.forEach(contentPath => {
    // If contentPath is for a directory, read contents from inside the directory
    if (fs.lstatSync(contentPath).isDirectory()) {
      scannedContent = [...scannedContent, ...scanFilesDeep(contentPath)];
    } else {
      scannedContent = [...scannedContent, contentPath];
    }
  });

  return scannedContent;
}

function findMessagesFilePaths(): string[] {
  const srcFiles = scanFilesDeep(variables.rootDirPath);

  return srcFiles.filter(filePath =>
    variables.messagesFilesRegex.test(filePath),
  );
}

function generateDescriptiveTerm(
  message: string,
  description?: string,
): string {
  if (description) {
    return `${message} [${description}]`;
  }

  return message;
}

async function loadMessagesFromFile(
  filePath: string,
): Promise<Record<string, string>> {
  const fileContent: Record<string, TranslationMessage> = (
    await import(filePath)
  ).default;

  const extractedMessages: Record<string, string> = {};

  Object.values(fileContent).forEach(messageObj => {
    const {id, message, description} = messageObj;

    if (typeof message === 'object') {
      Object.keys(message).forEach(key => {
        extractedMessages[`${id}_${key}`] = generateDescriptiveTerm(
          message[key as TraslationQuantifier] as string,
          description,
        );
      });
    } else {
      extractedMessages[id] = generateDescriptiveTerm(message, description);
    }
  });

  return extractedMessages;
}

function logTermsStats(
  currentTerms: Record<string, string>,
  newTerms: Record<string, string>,
): void {
  const extractedTerms: number = Object.keys(newTerms).length;
  let termsAdded: number = 0;
  let termsChanged: number = 0;
  let termsRemoved: number = 0;

  Object.keys({...currentTerms, ...newTerms}).forEach(key => {
    const currentTerm: string | undefined = currentTerms[key];
    const newTerm: string | undefined = newTerms[key];

    if (!currentTerm && newTerm) {
      return termsAdded++;
    }
    if (currentTerm && !newTerm) {
      return termsRemoved++;
    }
    if (newTerm !== currentTerm) {
      return termsChanged++;
    }
  });

  console.log('\n--------------------\n');

  console.log(`${chalk.bold(extractedTerms)} terms extracted\n`);

  console.log(chalk.green(`${chalk.bold(termsAdded)} terms added`));
  console.log(chalk.red(`${chalk.bold(termsRemoved)} terms removed`));
  console.log(chalk.yellow(`${chalk.bold(termsChanged)} terms changed`));

  console.log('\n--------------------\n');
}

function saveMessagesToTermsFile(messages: Record<string, string>): void {
  let currentTerms: Record<string, string> = {};
  try {
    const currentFileContent: string = fs.readFileSync(
      variables.termsFilePath,
      'utf8',
    );
    currentTerms = JSON.parse(currentFileContent);
  } catch (e) {
    console.log(
      chalk.yellow('Terms file not found. -> A new one will be created.'),
    );
  }

  logTermsStats(currentTerms, messages);

  fs.writeFileSync(variables.termsFilePath, JSON.stringify(messages, null, 2));
}

async function run() {
  let extractedMessages: Record<string, string> = {};

  const messagesFilePaths: string[] = findMessagesFilePaths();

  for (const filePath of messagesFilePaths) {
    const messages = await loadMessagesFromFile(filePath);

    extractedMessages = {
      ...extractedMessages,
      ...messages,
    };
  }

  saveMessagesToTermsFile(extractedMessages);
}

run();
