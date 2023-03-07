import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import promptSync from 'prompt-sync';

import {SortedTranslations, Term, TermsJson, TermsMap} from '../types';
import variables from './variables';

/**
 * Load and parse the json file found in the provided path
 *
 * @param filePath  Path for the json file
 * @returns         Parsed json
 */
export function loadJsonFile<T>(filePath: string): T {
  const termsFileContent: string = fs.readFileSync(filePath, 'utf8');

  return JSON.parse(termsFileContent);
}

/**
 * Sort the new translations and update the messages based on the term status
 *
 * @param currentTerms              Current terms found in `terms.json`
 * @param currentTranslations       Current translations found in the language
 *                                  file
 * @param autoUpdateTranslations    Update translations with term message
 *                                  automatically
 * @returns                         The sorted translations
 */
function getTranslationsByTermStatus(
  currentTerms: TermsMap,
  currentTranslations: Record<string, string>,
  autoUpdateTranslations: boolean,
): SortedTranslations {
  const addedTranslations: Record<string, string> = {};
  const updatedTranslations: Record<string, string> = {};
  const unchangedTranslations: Record<string, string> = {};
  const removedTranslations: Record<string, string> = {};

  Object.keys(currentTerms).forEach(key => {
    const term: Term = currentTerms[key];
    const translation: string | undefined = currentTranslations[key];

    /**
     * NEW modifier:
     * - term was added
     * - term was updated or unchanged but translation doesn't exist
     * UPDATED modifier:
     * - term was updated
     * REMOVED modifier:
     * - term was removed
     * No modifier:
     * - term is unchanged and translation exists
     */

    if (
      term.status === 'added' ||
      (term.status !== 'removed' && !translation)
    ) {
      if (autoUpdateTranslations) {
        addedTranslations[key] = term.message;
      } else {
        addedTranslations[`[NEW]${key}`] = `[${term.message}]`;
      }
      return;
    }

    if (term.status === 'updated') {
      if (autoUpdateTranslations) {
        updatedTranslations[key] = term.message;
      } else {
        updatedTranslations[
          `[UPDATED]${key}`
        ] = `${translation} [${term.message}]`;
      }
      return;
    }

    if (term.status === 'removed') {
      removedTranslations[`[REMOVED]${key}`] = `[${translation}]`;
    }

    if (term.status === 'unchanged') {
      unchangedTranslations[key] = translation;
      return;
    }
  });

  return {
    addedTranslations,
    updatedTranslations,
    unchangedTranslations,
    removedTranslations,
  };
}

/**
 * Checks if the translation file is based on the current terms version
 *
 * @param termsVersion          Current terms version
 * @param currentTranslations   Current translation file
 * @returns                     If the current translation is based on the terms
 *                              version
 */
function checkTranslationSameVersion(
  termsVersion: string,
  currentTranslations: Record<string, string>,
): boolean {
  const translationVersion = currentTranslations['[VERSION]'];
  return termsVersion === translationVersion;
}

/**
 * Asks the user if he wishes to continue with an update for a translation file
 * that is already based on the latest terms.
 *
 * Continuing with the translation might result in loosing translated terms.
 *
 * @param language      Language of the translation file
 * @param termsVersion  Version of the `terms.json` file
 * @returns             If the user decided to continue or not the update
 */
function shouldContinueUpdate(language: string, termsVersion: string): boolean {
  console.log('\n--------------------\n');

  console.log(
    chalk.bold(
      `The current ${language}.json is already based on the latest extracted terms (version ${termsVersion})`,
    ),
  );
  console.log(
    chalk.yellow(
      `Continuing with the update for ${chalk.bold(
        language,
      )} might result in losing already translated terms.\n`,
    ),
  );

  const prompt = promptSync();
  const response: string = prompt(
    `Are you sure you want to continue with the update for ${language}? (y/${chalk.bold(
      'n',
    )}): `,
    'n',
  );

  return response.toLowerCase() === 'y';
}

/**
 * Load the translation file for the language and update the current
 * translations.
 *
 * @param currentTerms              Current terms found in `terms.json`
 * @param language                  Language to update
 * @param autoUpdateTranslations    Update translations with term message
 *                                  automatically
 * @returns                         The sorted translations
 */
export function updateTranslationsForLanguage(
  currentTerms: TermsJson,
  language: string,
  autoUpdateTranslations: boolean,
): SortedTranslations {
  const filePath: string = path.join(
    variables.translationsDirPath,
    `${language}.json`,
  );

  let currentTranslations: Record<string, string> = {};

  try {
    currentTranslations = loadJsonFile(filePath);
  } catch (e) {
    console.log(
      chalk.yellow(
        `Translation file for ${language} not found. -> A new one will be created.`,
      ),
    );
  }

  const isTranslationSameVersion: boolean = checkTranslationSameVersion(
    currentTerms.version,
    currentTranslations,
  );

  if (isTranslationSameVersion && !autoUpdateTranslations) {
    if (!shouldContinueUpdate(language, currentTerms.version)) {
      throw new Error(`Update for ${language} cancelled by user.`);
    }
  }

  const sortedTranslations: SortedTranslations = getTranslationsByTermStatus(
    currentTerms.terms,
    currentTranslations,
    autoUpdateTranslations,
  );

  return sortedTranslations;
}

/**
 * Friendly console log with script results for each available language
 *
 * @param translations              New sorted translations
 * @param language                  Language of the translations
 * @param autoUpdateTranslations    Translations are automatically generated
 */
export function logTranslationsStats(
  translations: SortedTranslations,
  language: string,
  autoUpdateTranslations: boolean,
): void {
  const addedTranslationsCount: number = Object.keys(
    translations.addedTranslations,
  ).length;
  const updatedTranslationsCount: number = Object.keys(
    translations.updatedTranslations,
  ).length;
  const unchangedTranslationsCount: number = Object.keys(
    translations.unchangedTranslations,
  ).length;
  const removedTranslationsCount: number = Object.keys(
    translations.removedTranslations,
  ).length;

  console.log('\n--------------------\n');

  console.log(
    `Finished ${autoUpdateTranslations ? 'auto ' : ''}updating ${chalk.bold(
      language,
    )} translations\n`,
  );

  console.log(
    chalk.green(
      `${chalk.bold(addedTranslationsCount)} translations were added`,
    ),
  );
  console.log(
    chalk.yellow(
      `${chalk.bold(updatedTranslationsCount)} translations were updated`,
    ),
  );
  console.log(
    chalk.red(
      `${chalk.bold(removedTranslationsCount)} translations were removed`,
    ),
  );
  console.log(
    `${chalk.bold(unchangedTranslationsCount)} translations were not changed`,
  );

  if (
    !autoUpdateTranslations &&
    (addedTranslationsCount > 0 || updatedTranslationsCount > 0)
  ) {
    console.log(
      chalk.bold(
        `\n>> Be sure to check the new version of the ${chalk.underline(
          `${language}.json`,
        )} file and update the translations`,
      ),
    );
  }

  console.log('\n--------------------\n');
}

/**
 * Save the new translations into the language translation file
 *
 * @param translations  New translations
 * @param language      Language to update
 */
export function saveTranslationsFile(
  translations: SortedTranslations,
  termsVersion: string,
  language: string,
): void {
  const filePath: string = path.join(
    variables.translationsDirPath,
    `${language}.json`,
  );

  const mergedTranslations: Record<string, string> = {
    '[VERSION]': termsVersion,
    ...translations.addedTranslations,
    ...translations.updatedTranslations,
    ...translations.unchangedTranslations,
  };

  fs.writeFileSync(filePath, JSON.stringify(mergedTranslations, null, 2));
}
