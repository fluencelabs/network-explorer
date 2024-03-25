// This module relates to deal-explorer-client.
import { exec } from 'child_process'

import type { CodegenConfig } from '@graphql-codegen/cli'
import * as dotenv from 'dotenv'

dotenv.config()

const CODEGEN_SUBGRAPH_URL =
  process.env.CODEGEN_SUBGRAPH_URL ??
  'https://graph-node.kras.fluence.dev/subgraphs/name/fluence-deal-contracts'

const config: CodegenConfig = {
  overwrite: true,
  schema: CODEGEN_SUBGRAPH_URL,
  documents: 'src/clients/dealExplorerClient/queries/*.graphql',
  emitLegacyCommonJSImports: false,
  generates: {
    'src/clients/dealExplorerClient/generated.types.ts': {
      plugins: [
        {
          add: {
            content: '/* eslint-disable */\n//@ts-nocheck',
          },
        },
        'typescript',
      ],
      config: {
        scalars: {
          BigInt: 'string',
          Int8: 'number',
        },
        enumsAsTypes: true,
      },
    },
    'src/clients/dealExplorerClient/': {
      preset: 'near-operation-file',
      presetConfig: {
        extension: '.generated.ts',
        baseTypesPath: 'generated.types.ts',
      },
      plugins: [
        {
          add: {
            content: '/* eslint-disable */\n//@ts-nocheck',
          },
        },
        'typescript-operations',
        'typescript-graphql-request',
      ],
      hooks: {
        // TODO: hook is a kinda trick here because of the graphql-client wrong imports for esm.
        //  Thus, basically we should migrate to another client.
        afterOneFileWrite: (filenamePath: string) => {
          console.log(
            '[afterOneFileWrite] Execute 2 sed to change imports for file:',
            filenamePath,
          )
          exec(
            "sed -i '' -e \"s/import { GraphQLClient } from 'graphql-request';/import { GraphQLClient } from 'graphql-request';\\nimport type { RequestOptions } from 'graphql-request';/g\" " +
              filenamePath,
          )
          exec(
            "sed -i '' -e \"s/import { GraphQLClientRequestHeaders } from 'graphql-request\\/build\\/esm\\/types.js';/type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];/g\" " +
              filenamePath,
          )
        },
      },
    },
  },
}

export default config
