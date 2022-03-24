# intl-parse-accept-language

Returns an array of `locale` strings, sorted by quality, given the string from an HTTP `Accept-Language` header.

- Returned value is compatible with the `locales` argument of `Intl.DateTimeFormat`
- Written in TypeScript and fully typed
- 100% test coverage

## Example

```ts
import { parseAcceptLanguage } from 'intl-parse-accept-language';

const locales = acceptLanguage('en-US,es;q=0.6,en;q=0.8,*;q=0.1');
// => ['en-US', 'en', 'es']
```

## Configuration

`parseAcceptLanguage` accepts an optional configuration object as the second argument

| option         | description                                                                                                                                                                                                                                                              |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| validate       | A validate callback that is called for each `locale`. If the `locale` is valid, return the `locale` as a string. Otherwise return `undefined`, `null`, or an empty Array. Should the callback throw an error, the error will be caught and the `locale` will be ignored. |
| ignoreWildcard | A boolean that if set to `true`, the wildcard locale `*` will be returned in the array. If set to `false`, the wildcard locale `*` will be ignored. Defaults to `true`.                                                                                                  |

## Pro Tip

If you're using the `locales` array to do date formatting, you may want to use `Intl.DateTimeFormat.supportedLocalesOf` as the `validate` callback. This way only locales that are valid for date formatting will be returned.

For example:

```ts
import { parseAcceptLanguage } from 'intl-parse-accept-language';

const locales = parseAcceptLanguage('en-US,foo-BAR', {
  validate: Intl.DateTimeFormat.supportedLocalesOf,
});
// => ['en-US']
```

## Getting Started

Install the library with your package manager of choice, e.g.:

```
npm i intl-parse-accept-language
```

or

```
yarn add intl-parse-accept-language
```

## Other works

- [parse-accept-language](https://npm.im/parse-accept-language)
- [accept-language-parser](https://npm.im/accept-language-parser)

## License

&copy; 2022 Donavon West. Released under [MIT license](./LICENSE).
