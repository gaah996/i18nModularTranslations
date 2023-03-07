import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

import variables from './variables';
import {
  ExtractedMessage,
  ExtractedMessages,
  Term,
  TermsJson,
  TranslationMessage,
  TraslationQuantifier,
} from '../types';

/**
 * Scan all files under the provided dirPath, including nested folders contents
 *
 * @param dirPath   Directory path to scan
 * @returns         Scanned files paths
 */
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

/**
 * Find all `messages.ts` file paths in the project
 *
 * @returns   Path for each message file
 */
export function findMessagesFilePaths(): string[] {
  const srcFiles = scanFilesDeep(variables.rootDirPath);

  return srcFiles.filter(filePath =>
    variables.messagesFilesRegex.test(filePath),
  );
}

/**
 * Extract the messages in the provided message file
 *
 * @param filePath    Message file path
 * @returns           Extracted messages
 */
export async function loadMessagesFromFile(
  filePath: string,
): Promise<ExtractedMessages> {
  const fileContent: Record<string, TranslationMessage> = (
    await import(filePath)
  ).default;

  const extractedMessages: ExtractedMessages = {};

  Object.values(fileContent).forEach(messageObj => {
    const {id, message, description} = messageObj;

    if (typeof message === 'object') {
      Object.keys(message).forEach(key => {
        extractedMessages[`${id}_${key}`] = {
          message: message[key as TraslationQuantifier] as string,
          description,
        };
      });
    } else {
      extractedMessages[id] = {message, description};
    }
  });

  return extractedMessages;
}

/**
 * Creates the TranslationTerms combining the provided messages and current
 * terms
 *
 * @param currentTerms        Current `terms.json` file content
 * @param extractedMessages   Extracted messages from the app
 * @returns                   New `terms.json` file content
 */
function createTermsFromMessages(
  currentTerms: TermsJson,
  extractedMessages: ExtractedMessages,
): TermsJson {
  const updatedTerms: TermsJson = {};

  Object.keys({...currentTerms, ...extractedMessages}).forEach(key => {
    const currentTerm: Term | undefined = currentTerms[key];
    const newMessage: ExtractedMessage | undefined = extractedMessages[key];

    if (!currentTerm && !!newMessage) {
      updatedTerms[key] = {
        status: 'added',
        message: newMessage.message,
        description: newMessage.description,
      };
      return;
    }
    if (!!currentTerm && !newMessage) {
      updatedTerms[key] = {
        status: 'removed',
        message: currentTerm.message,
        description: currentTerm.description,
      };
      return;
    }
    if (currentTerm.message !== newMessage.message) {
      updatedTerms[key] = {
        status: 'updated',
        message: newMessage.message,
        previousMessage: currentTerm.message,
        description: newMessage.description,
      };
      return;
    }

    updatedTerms[key] = {
      status: 'unchanged',
      message: currentTerm.message,
      description: currentTerm.description,
    };
  });

  return updatedTerms;
}

/**
 * Friendly console log with script results
 *
 * @param extractedMessages   Extract messages from the app
 * @param generatedTerms      New `terms.json` file content
 */
function logTermsStats(
  extractedMessages: ExtractedMessages,
  generatedTerms: TermsJson,
): void {
  function countTermsWithStatus(
    terms: TermsJson,
    status: Term['status'],
  ): number {
    let count: number = 0;
    Object.values(terms).forEach(term => {
      if (term.status === status) {
        count++;
      }
    });

    return count;
  }

  const extractedMessagesCount: number = Object.keys(extractedMessages).length;
  const addedTermsCount: number = countTermsWithStatus(generatedTerms, 'added');
  const changedTermsCount: number = countTermsWithStatus(
    generatedTerms,
    'updated',
  );
  const removedTermsCount: number = countTermsWithStatus(
    generatedTerms,
    'removed',
  );
  const unchangedTermsCount: number = countTermsWithStatus(
    generatedTerms,
    'unchanged',
  );

  console.log('\n--------------------\n');

  console.log(`${chalk.bold(extractedMessagesCount)} terms extracted\n`);

  console.log(chalk.green(`${chalk.bold(addedTermsCount)} terms added`));
  console.log(chalk.red(`${chalk.bold(changedTermsCount)} terms removed`));
  console.log(chalk.yellow(`${chalk.bold(removedTermsCount)} terms changed`));
  console.log(
    chalk.white(`${chalk.bold(unchangedTermsCount)} terms unchanged`),
  );

  console.log('\n--------------------\n');
}

/**
 * Convert the extracted messages to terms and saves to `terms.json` file
 *
 * @param messages    Extracted messages
 */
export function saveMessagesToTermsFile(messages: ExtractedMessages): void {
  let currentTerms: TermsJson = {};
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

  const updatedTerms: TermsJson = createTermsFromMessages(
    currentTerms,
    messages,
  );

  logTermsStats(messages, updatedTerms);

  fs.writeFileSync(
    variables.termsFilePath,
    JSON.stringify(updatedTerms, null, 2),
  );
}
