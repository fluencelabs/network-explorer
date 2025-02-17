import { ContractsENV, SUBGRAPH_URLS } from '@fluencelabs/deal-ts-clients'
import type { CodegenConfig } from '@graphql-codegen/cli'
import * as dotenv from 'dotenv'
dotenv.config()

const pluginsConfig = {
  /**
   * Fail if there are unknown scalars (that are mapped to `any` type)
   */
  strictScalars: true,
  /**
   * Import types with `import type { ... }`
   */
  useTypeImports: true,
  emitLegacyCommonJSImports: false,
  enumsAsTypes: true,
  /**
   * The Graph custom scalars
   */
  scalars: {
    BigInt: 'string',
    BigDecimal: 'string',
    Bytes: 'string',
    Int8: 'number',
    Timestamp: 'number',
  },
  /**
   * This makes import look like `import { gql } from "graphql-tag"`
   * and not `import gql from "graphql-tag"`, fixing "This expression is not callable"
   */
  gqlImport: 'graphql-tag#gql',
}

const FLUENCE_CLIENT_NETWORK = (process.env.VITE_FLUENCE_CLIENT_NETWORK ||
  'local') as ContractsENV

const config: CodegenConfig = {
  schema: SUBGRAPH_URLS[FLUENCE_CLIENT_NETWORK],
  documents: 'src/**/*.graphql',
  generates: {
    'generated/graphql.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-graphql-request',
      ],
      config: pluginsConfig,
    },
  },
  watch: false,
}

export default config
