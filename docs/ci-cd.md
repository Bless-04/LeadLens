# Continuous integration and Vercel deployment

## Automated checks

[CI](../.github/workflows/ci.yml) runs on every pull request, pushes to `main`,
and manual runs from GitHub's Actions tab. It uses Node 24 from `.nvmrc`, installs
exactly the dependencies in `package-lock.json` with `npm ci`, rejects committed
merge-conflict markers, then runs:

```sh
npm run check
```

This executes the TypeScript check, all Vitest tests, and the production Vite
build in order. The build copies the current entry page's classic JavaScript
files into `dist/js`; Vite processes its CSS. This preserves the team's static
frontend without changing its design. React components remain type-checked too.
Any failure fails the job. Tests are not allowed to pass with
zero tests. A successful build is retained as the `leadlens-dist` Actions artifact
for seven days. Superseded runs for the same branch are canceled. The workflow
has read-only repository permissions and needs no secrets.

To reproduce locally:

```sh
nvm use # or otherwise install Node 24
npm ci
npm run check
```

In the managed cloud environment, if npm's home cache is unwritable, use
`npm ci --cache /tmp/leadlens-npm-cache` instead of `npm ci`.

## Deployment stays with Vercel

Keep the existing Vercel Git integration connected to `chiefbumi/LeadLens`.
There is no GitHub Actions deployment job and no additional Vercel token is
required. Vercel handles its own production and preview deployments according
to the connected project's Git settings.

[vercel.json](../vercel.json) configures the Vite framework, `npm ci` installation,
`npm run check` build command, and `dist` output directory. `package.json` pins
the Node major version to 24 for both CI and Vercel. Vercel runs the same checks
before producing a deployment, so a test, type, or build failure prevents that
Vercel build from deploying. Its existing successful production deployment
remains available if a new build fails.

GitHub Actions and Vercel may run concurrently. Vercel does not wait for the
GitHub CI status: it enforces these checks in its own build. The Actions artifact
is for inspection; Vercel builds the connected commit itself.

In the existing Vercel project, keep the root directory at the repository root
and the production branch at `main` if that is the intended production branch.
No new Vercel project needs to be created. Check the next deployment's build log
for `npm run check`, followed by the type check, unit tests, and Vite build.
A live Vercel deployment is not verified merely by committing this configuration.

## Optional merge protection

To prevent merges with a failing CI job, add a GitHub ruleset for `main` requiring
`Typecheck, test, and build` after the first workflow run. CI alone does not
configure branch protection or prevent direct pushes. No account settings or
branch protection are changed by these files.
