export type TraslationQuantifier =
  | 'zero'
  | 'one'
  | 'two'
  | 'few'
  | 'many'
  | 'other';

export interface TranslationMessage {
  id: string;
  message: string | Partial<Record<TraslationQuantifier, string>>;
  description?: string;
}

export interface ExtractedMessage {
  message: string;
  description?: string;
}

export type ExtractedMessages = {
  [id: string]: ExtractedMessage;
};

export interface Term {
  status: 'added' | 'updated' | 'removed' | 'unchanged';
  message: string;
  previousMessage?: string;
  description?: string;
}

export type TermsJson = {
  [id: string]: Term;
};
