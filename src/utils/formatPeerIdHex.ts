import { base58btc } from 'multiformats/bases/base58'

/**
 * Fluence peer ids encoding follows the libp2p spec:
 * https://github.com/libp2p/specs/blob/master/peer-ids/peer-ids.md.
 *
 * - Peer PK is bytes (32 bytes for Ed25519)
 * - Peer PK is encoded with key type into protobuf (1 for Ed25519)
 * - Peer ID is encoded Peer PK hashed using multihash (identity hash)
 * - Peer ID text representation is Peer ID encoded with base58btc
 *
 * On chain Peer PK is stored as bytes32.
 * Off chain Peer ID text representation is used.
 */

const PEER_BYTE58_PREFIX = new Uint8Array([
  0, // identity hash
  36, // length of the following data in bytes
  8, // protobuf varint tag
  1, // varint value (1 for Ed25519 key type)
  18, // protobuf bytes tag
  32, // length of the following data in bytes (Peer PK)
])

const BASE_58_PREFIX = 'z'

export function peerIdContractHexToBase58(peerIdHex: string) {
  return base58btc
    .encode(
      Buffer.concat([
        PEER_BYTE58_PREFIX,
        Buffer.from(peerIdHex.slice(2), 'hex'),
      ]),
    )
    .slice(BASE_58_PREFIX.length)
}
