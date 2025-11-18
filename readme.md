# sonare

> Pronounceable and organic words that feel natural.

A lightweight library that generates unique, pronounceable and organic words that feel natural.

- **Highly Unique**: >85% uniqueness even when generating 1 million words
- **Pronounceable**: Uses phoneme-based generation for easy-to-say words
- **Customizable**: Configure minimum and maximum word length
- **Lightweight**: Zero dependencies
- **Fast**: Optimized for high-volume generation

## Installation

```bash
# pnpm
pnpm add sonare

# npm
npm install sonare

# yarn
yarn add sonare
```

## Usage

### Basic Usage

```ts
import { sonare } from 'sonare';

const word = sonare();
console.log(word); // e.g., "veluna" or "minecho"
```

### Custom Length

```ts
import { sonare } from 'sonare';

const word = sonare({ minLength: 4, maxLength: 6 });
console.log(word); // e.g., "luna" or "vexar"

const word = sonare({ minLength: 10, maxLength: 15 });
console.log(word); // e.g., "velunambor" or "crisechoten"
```

### Generate Multiple Unique words

```ts
import { sonare } from 'sonare';

const words = Array.from({ length: 100 }, () => sonare());
console.log(words); // ["ambor", "tenen", "zilfer", ...]
```

## API Reference

### `sonare(options?: SonareOptions): string`

Generates a single pronounceable word.

**Parameters:**

- `options` (optional): Configuration object
  - `minLength` (number, default: `6`): Minimum length of the generated word
  - `maxLength` (number, default: `10`): Maximum length of the generated word

**Returns:**

- `string`: A pronounceable word containing only lowercase letters

**Example:**

```ts
const word = sonare({ minLength: 8, maxLength: 12 });
```

## License

MIT

## Author

- Bu Kinoshita ([@bukinoshita](https://x.com/bukinoshita)) — [Resend](https://resend.com)
- Zeh Fernandes ([@zehf](https://x.com/zehf)) — [Resend](https://resend.com)
