import {StringMap, t as i18t, TOptionsBase} from 'i18next';

interface TranslationMessage {
  id: string;
  message: string;
  description?: string;
}

/**
 * Wrapper around the i18next `t` function, that takes a TranslationMessage as
 * parameter
 *
 * @param message   Translation message
 * @param options   Extra options taken by the `t` function
 * @returns         A translated message string
 */
export function t(
  message: TranslationMessage,
  options?: TOptionsBase & StringMap,
): string {
  return i18t(message.id, {
    defaultValue: message.message,
    ...options,
  });
}

/**
 * Helper function to prepend the namespace to TranslationMessage ids
 *
 * @param namespace     Namespace to prepend
 * @returns             The TranslationMessage map with the correct id
 */
export function namespacedMessages(namespace: string) {
  return function <T extends Record<string, TranslationMessage>>(
    messages: T,
  ): T {
    const enhancedMessages: T = {} as T;

    Object.keys(messages).forEach((key: keyof T) => {
      enhancedMessages[key] = {
        ...messages[key],
        id: `${namespace}.${messages[key].id}`,
      };
    });

    return enhancedMessages;
  };
}
