# Fluence Network Explorer

Stack: React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Dependency
## DealExplorerClient

This client delivers data for the Network Explorer Web Application. The client consists of 3 TS clients:

- DealContractsClient - to load env {kras, testnet, stage} and deployed contracts
- DealRpcClient - with built-in multicall3 contract feature (1 JSON RPC request per several view calls on different Fluence contracts)
- IndexerClient - to fetch built GraphQL models from the indexer (i.e. The Graph/Subgraph)

> Each getter method of the DealExplorerClient linked relate to the Figma views accordingly.

### Codegen
It uses generated files by [codegen.ts](codegen.ts). 

> Note, You may want to configure subgraph url for the types by your-self, e.g. localhost for development. To do so change params in .env according to .example.env.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
   parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
   },
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
