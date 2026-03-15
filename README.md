<div align="center">
<h1>Optal.dk</h1>
The official optal.dk repository.
</div>

### Apps and packages

- `web`: The frontend using SvelteKit.
- `api`: A small backend using Node.js and Fastify.
- `eslint-config-custom`: `eslint` configurations.
- `i18n`: Translations for use across the repo.
- `reader`: Utilities used for transforming raw data in .csv format into more readable formats.

### Running locally

#### Running the frontend

Make sure you have [Node.js](https://nodejs.org/en) installed. Clone or fork the repo, cd into the directory, and run:

```bash
npm install

npm run web:dev
```

This opens the web server on port 5173. Running the frontend alone is sufficient for most development although using the feature for posting feedback specifically won't work.

#### Running the frontend and backend

To run the backend and frontend simultaneously (and thus enable the feedback feature), make sure you have [Docker Desktop](https://docs.docker.com/desktop/) and the [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started) installed in addition the above dependencies. We need these to run the Supabase instance locally. Then simply run:

```bash
npm run dev
```

#### Transforming data through the `reader` package

To test the utilities for transforming the raw .csv files into other formats, run the test script:

```bash
npm run reader:test:watch
```

To populate the frontend with the files generated from the reader package, run:

```bash
npm run reader:gen
```

### Contributing

Contributions are greatly appreciated.

For bug reports or feature requests, use the "Issues" tab. Describe the feature in detail if it's a feature request and describe the bug and the steps to reproduce if it's a bug report.

For PR's, fork the repo and open a PR. In the PR, describe the implementation and the steps to test it.

### More information

A broad technical description of the project is available [here](https://www.mpol.dev/projects/optal).
