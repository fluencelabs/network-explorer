import { ContractsENV, SUBGRAPH_URLS } from '@fluencelabs/deal-ts-clients'
import type { CodegenConfig } from '@graphql-codegen/cli'
import * as dotenv from 'dotenv'
dotenv.config()

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
      config: {
        rawRequest: true,
      },
    },
  },
  watch: true,
}

export default config
