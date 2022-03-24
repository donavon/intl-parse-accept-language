export type Options = {
  /**
   * A validate callback that is called for each `locale`. If the `locale` is valid, return the `locale` as a string.
   * Otherwise return `undefined`, `null`, or an empty Array.
   * Should the callback throw an error, the error will be caught and the `locale` will be ignored.
   */
  validate?: (locale: string) => string | string[] | null | undefined;

  /**
   * If set to `true`, the wildcard locale `*` will be returned in the array.
   * If set to `false`, the wildcard locale `*` will be ignored.
   * Defaults to `true`.
   */
  ignoreWildcard?: boolean;
};

const defaultValidate = (locale: string) => locale;

export const parseAcceptLanguage = (
  /** The value from the `Accept-Language` header.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language
   */
  languageHeaderValue: string | null | undefined,
  options: Options = {}
): string[] => {
  if (!languageHeaderValue) return [];
  const { ignoreWildcard = true, validate = defaultValidate } = options;

  return languageHeaderValue
    .split(',')
    .map((lang): [number, string] => {
      const [locale, q = 'q=1'] = lang.split(';');
      const trimmedLocale = locale.trim();
      const numQ = Number(q.replace(/q ?=/, ''));
      if (isNaN(numQ)) return [0, trimmedLocale];
      return [numQ, trimmedLocale];
    })
    .sort(([q1], [q2]) => q2 - q1)
    .flatMap(([_, locale]) => {
      if (locale === '*' && ignoreWildcard) return [];
      try {
        return validate(locale) || [];
        // return Intl.DateTimeFormat.supportedLocalesOf(locale);
      } catch {
        return [];
      }
    });
};
