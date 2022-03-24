import { parseAcceptLanguage } from '.';

describe('parseAcceptLanguage', () => {
  test('returns an empty array if passed null or undefined', () => {
    expect(parseAcceptLanguage(null)).toEqual([]);
    expect(parseAcceptLanguage(undefined)).toEqual([]);
  });

  // prettier-ignore
  test('sorts by quality', () => {
  expect(parseAcceptLanguage('en')).toEqual(['en']);
  expect(parseAcceptLanguage('en-US')).toEqual(['en-US']);
  expect(parseAcceptLanguage('en-US, en')).toEqual(['en-US', 'en']);
  expect(parseAcceptLanguage('en-US, en;q=0.5')).toEqual(['en-US', 'en']);
  expect(parseAcceptLanguage('en-US, en;q=0.5, fr')).toEqual(['en-US','fr','en']);
  expect(parseAcceptLanguage('en-US, en;q=0.5, fr;q=0.8')).toEqual(['en-US', 'fr', 'en']);
  expect(parseAcceptLanguage('en-US, en;q=0.5, fr;q=0.8, de')).toEqual(['en-US', 'de', 'fr', 'en']);
  expect(parseAcceptLanguage('en-US, en;q=0.5, fr;q=0.8, de;q=0.9')).toEqual(['en-US', 'de', 'fr', 'en']);
  expect(parseAcceptLanguage('en-US, en;q=0.5, fr;q=0.8, de;q=0.9, *')).toEqual(['en-US', 'de', 'fr', 'en']);
  expect(parseAcceptLanguage('en-US, en;q=0.5, fr;q=0.8, de;q=0.9, *;q=0.1')).toEqual(['en-US', 'de', 'fr', 'en']);
  expect(parseAcceptLanguage('en;q=0.5, fr;q=0.8, de;q=0.9, *;q=0.1,en-US')).toEqual(['en-US', 'de', 'fr', 'en']);
});

  test('works with or without spaces', () => {
    expect(parseAcceptLanguage(' en-US, en ')).toEqual(['en-US', 'en']);
    expect(parseAcceptLanguage('en-US,en')).toEqual(['en-US', 'en']);
    expect(
      parseAcceptLanguage('en-US,en; q = 0.5, fr; q= 0.8,de; q= 0.9, *')
    ).toEqual(['en-US', 'de', 'fr', 'en']);
  });

  test('sort invalid "q" values at the end', () => {
    expect(
      parseAcceptLanguage('en-US, en;q=0.5, fr;x=0.8, de;q=0.9, *') // fr;x=0.8 is invalid
    ).toEqual(['en-US', 'de', 'en', 'fr']);
  });
});

describe('config.ignoreWildcard', () => {
  test('returns "*" if set to false', () => {
    const ignoreWildcard = false;
    expect(parseAcceptLanguage('en-US,*', { ignoreWildcard })).toEqual([
      'en-US',
      '*',
    ]);
  });

  test('ignores "*" if set to true', () => {
    const ignoreWildcard = true;
    expect(parseAcceptLanguage('en-US,*', { ignoreWildcard })).toEqual([
      'en-US',
    ]);
  });

  test('defaults to true', () => {
    expect(parseAcceptLanguage('en-US,*')).toEqual(['en-US']);
  });
});

describe('config.validate', () => {
  describe('ignores the passed locale if the callback', () => {
    test('throws', () => {
      const validate = (locale: string) => {
        if (locale === 'en-US') return locale;
        throw new TypeError('Invalid locale');
      };
      expect(parseAcceptLanguage('en-US,fr-FR', { validate })).toEqual([
        'en-US',
      ]);
    });

    test('returns undefined', () => {
      const validate = (locale: string) => {
        if (locale === 'en-US') return locale;
        return undefined;
      };
      expect(parseAcceptLanguage('en-US,fr-FR', { validate })).toEqual([
        'en-US',
      ]);
    });

    test('returns an empty array', () => {
      const validate = (locale: string) => {
        if (locale === 'en-US') return locale;
        return [];
      };
      expect(parseAcceptLanguage('en-US,fr-FR', { validate })).toEqual([
        'en-US',
      ]);
    });
  });
});
