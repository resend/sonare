# sonare

## What this codebase does

`sonare` is a zero-dependency TypeScript library, published to npm, that
generates pronounceable pseudo-words. The whole public surface is one
function, `sonare({ minLength, maxLength })`, returning a lowercase ASCII
string. It is pure in-process computation: phoneme tables (`phonemes.ts`,
`clusters.ts`) are combined by weighted pattern selection
(`select-pattern.ts`, `pattern.ts`), joined (`join-segments.ts`,
`can-join.ts`), then padded or trimmed to the requested length (`pad.ts`,
`trim-to-fit.ts`). Shipped code imports nothing outside `src/` and touches no
network, filesystem, process, or environment API. There is no server and no
CLI. The build is `tsup` (CJS + ESM); CI is two GitHub Actions workflows
(build, lint).

## Auth shape

None, by design. The library has no users, sessions, requests, or privileged
operations, so there are no auth primitives to look for and "missing auth" is
not a meaningful finding here. The only trust boundary is the `options`
argument of `sonare()`:

- `validateLengths` is the single input gate: finite integers, at least 1,
  `minLength <= maxLength`. It sets no upper bound.
- `SonareOptions` is a compile-time type only. Plain-JS callers can pass
  anything, so the runtime checks in `validateLengths` are what count.

## Threat model

The realistic risk is how consuming applications use the library, not the
library reaching anything sensitive. In order of impact: (1) an application
forwards untrusted `minLength`/`maxLength`; there is no upper bound, so time
and memory are caller-controlled; (2) an application treats output as
unguessable (tokens, passwords, invite codes, IDs of unlisted resources)
although it comes from a non-cryptographic generator with 32 bits of state;
(3) compromise of the published package through build tooling or the CI
workflows.

## Project-specific patterns to flag

- Work that scales with caller-supplied length. Review `appendPadding`
  (iterates and recurses until `minLength` is reached) together with
  `paddingPool` and `canJoin`, which run on the whole word at every step, for
  time, memory, and stack depth as a function of the requested length.
- The randomness chain in `sonare()`: `Date.now()` + counter +
  `Math.random()` into `hashSeed` (32-bit FNV-1a) into `createRng` (32-bit
  state). Flag code or docs that present output as guaranteed unique,
  unpredictable, or fit for secrets.
- `pick` on an empty pool returns `undefined`, which concatenation turns into
  the literal text `undefined`. Check that `paddingPool` can never be empty
  for any reachable word and budget.
- Module-level mutable state shared by every caller in a process: `state`
  (counter and last timestamp) and `candidateCache` (capped by
  `CACHE_LIMIT`). Flag unbounded growth or one caller influencing another's
  output.
- Workflow changes that add secrets, `pull_request_target`, write
  permissions, unpinned actions, or a publish step.

## Known false-positives

- `Math.random()` in `sonare.ts` is intentional: the library generates names,
  not secrets. Report it only where code or docs claim security properties.
- `insecure-crypto` "weak cipher" hits on identifiers containing `des`
  (`describe`, `includes`, `oldestKey`). There is no cryptography in this
  repo.
- `hashSeed` is a seed mixer, not a security hash. "Weak hash" findings on it
  are noise.
- `github.event.pull_request.number` in the workflows appears only in the
  `concurrency.group` key, never inside a `run:` script.
- `*.spec.ts` and `benchmarks/` are test and benchmark code. They are not
  published (`files` in `package.json` is `dist` plus the readme).
