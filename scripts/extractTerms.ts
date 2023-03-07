import {ExtractedMessages} from './types';
import {
  findMessagesFilePaths,
  loadMessagesFromFile,
  saveMessagesToTermsFile,
} from './utils/extractTerms.utils';

/**
 * This script extracts all terms that can be found in `messages.ts` files
 * across the app and updates the `terms.json` file.
 *
 * The `terms.json` file is an auto-generated file that contains all the
 * translation terms used to update the language translation files used by the
 * app in the production build.
 *
 * The update of the translation files is handled by the `updateTranslations.ts`
 * script.
 */
async function run() {
  let extractedMessages: ExtractedMessages = {};

  const messagesFilePaths: string[] = findMessagesFilePaths();

  for (const filePath of messagesFilePaths) {
    const messages: ExtractedMessages = await loadMessagesFromFile(filePath);

    extractedMessages = {
      ...extractedMessages,
      ...messages,
    };
  }

  saveMessagesToTermsFile(extractedMessages);
}

run();
