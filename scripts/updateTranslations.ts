import chalk from 'chalk';
import {SortedTranslations, TermsJson} from './types';
import {
  loadJsonFile,
  logTranslationsStats,
  saveTranslationsFile,
  updateTranslationsForLanguage,
} from './utils/updateTranslations.utils';
import variables from './utils/variables';

/**
 * This script updates all translation files based on the current `terms.json`
 * file.
 *
 * For the default language, all the translations are automatically updated.
 * While for the other ones, added and changed translations are marked and by
 * a [NEW] and [UPDATED] flags respectively, and need manual work to ensure
 * all translations in the file are properly done.
 */
function run() {
  const currentTerms: TermsJson = loadJsonFile(variables.termsFilePath);

  variables.availableLanguages.forEach(lang => {
    try {
      const translations: SortedTranslations = updateTranslationsForLanguage(
        currentTerms,
        lang,
        lang === variables.defaultLanguage,
      );

      logTranslationsStats(
        translations,
        lang,
        lang === variables.defaultLanguage,
      );

      saveTranslationsFile(translations, currentTerms.version, lang);
    } catch (e) {
      console.log(chalk.yellow(`>> Update cancelled for ${chalk.bold(lang)}.`));
    }
  });
}

run();
