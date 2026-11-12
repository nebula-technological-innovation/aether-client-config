# Nebula/Aether first-party dependency and TypeScript quality

This is an **offline quality gate** staged for review. It is not a production
release approval and does not use GitHub's paid Code Quality product.

## Reproducible controls

- A real npm v3 `package-lock.json` generated with npm and lifecycle scripts
  disabled, with package integrity entries and dependency-version evidence.
- `scripts/native-quality.mjs` checks that the lockfile is part of exact Git
  HEAD, validates clean tracked source, lockfile/root dependency consistency,
  integrity entries, and locally installed TypeScript typecheck if requested.
- Open-source Biome **2.5.12** is pinned as a dev dependency. The `lint` npm
  script is a real strict lint gate, no longer a placeholder.
- Builder capability defaults are explicit; TypeScript contract and native
  lint checks are both required.
- No automatic merge, deployment, paid model invocation, npm installation or
  network access is granted to the native quality script.

## Verified on an isolated Mac worktree

A frozen `npm ci --ignore-scripts --no-audit --no-fund` completed, the
TypeScript build and typecheck passed, strict Biome lint passed, and **10/10**
native contract tests passed. The public npm audit reported **0 advisories**
for this local locked dependency tree. Reproduce on the exact final PR commit
before approval. These checks are not a whole-company security certification.

## Reproducible commands

```sh
# Run only on an approved clean checkout with sufficient free disk.
npm ci --ignore-scripts --no-audit --no-fund
npm run typecheck
npm run build
npm run lint
npm run test
npm audit --audit-level=high --no-fund
node scripts/native-quality.mjs --typecheck --expected-sha "$(git rev-parse HEAD)"
```

When intentionally updating the lockfile, use a dedicated review commit and
`npm install --package-lock-only --ignore-scripts --no-audit --no-fund`,
inspect all package and license changes, then repeat the frozen install and
exact-commit suite. Avoid unverified overrides and untracked lockfiles.

Related portfolio rollout: https://github.com/nebula-technological-innovation/nebula-monorepo/issues/1236
