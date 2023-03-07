import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

import {SortedTranslations, Term, TermsJson} from '../types';
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
  currentTerms: TermsJson,
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

    switch (term.status) {
      case 'added':
        if (autoUpdateTranslations) {
          addedTranslations[key] = term.message;
        } else {
          addedTranslations[`[NEW]${key}`] = `[${term.message}]`;
        }
        break;
      case 'updated':
        if (autoUpdateTranslations) {
          updatedTranslations[key] = term.message;
        } else {
          updatedTranslations[
            `[UPDATED]${key}`
          ] = `${translation} [${term.message}]`;
        }
        break;
      case 'unchanged':
        unchangedTranslations[key] = translation;
        break;
      case 'removed':
        removedTranslations[`[REMOVED]${key}`] = `[${translation}]`;
        break;
      default:
        break;
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

  const sortedTranslations: SortedTranslations = getTranslationsByTermStatus(
    currentTerms,
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
      `${chalk.bold(unchangedTranslationsCount)} translations were removed`,
    ),
  );
  console.log(
    `${chalk.bold(removedTranslationsCount)} translations were not changed`,
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
  language: string,
): void {
  const filePath: string = path.join(
    variables.translationsDirPath,
    `${language}.json`,
  );

  const mergedTranslations: Record<string, string> = {
    ...translations.addedTranslations,
    ...translations.updatedTranslations,
    ...translations.unchangedTranslations,
  };

  fs.writeFileSync(filePath, JSON.stringify(mergedTranslations, null, 2));
}
