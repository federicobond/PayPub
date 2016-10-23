const fs = require('fs')
const bitcore = require('bitcore-lib')
const aescbc = require('bitcore-ecies/lib/aescbc')
const zip = require('lodash/fp/zip')

const files = ['files/foo', 'files/bar']

const contents = files.map(path => fs.readFileSync(path))

// Compute hash for each chunk
const hashes = contents.map(data => bitcore.crypto.Hash.sha256(data))

console.log(hashes.map(hash => hash.toString('hex')))

// The hash becomes a Bitcoin private key.
const keys = hashes.map(hash => new bitcore.PrivateKey(hash))

// We derive the public key.
const publicKeys = keys.map(key => key.publicKey)

// The address for that pubkey is the chunk's release address.
const addresses = publicKeys.map(key => key.toAddress())

// We hash the public key to get a secret.
const secrets = publicKeys.map(key => bitcore.crypto.Hash.sha256(key.toBuffer()))

// The chunk is encrypted using the secret with AES256.
const ciphertexts = zip(contents, secrets).map(([data, secret]) => {
  const ivbuf = bitcore.crypto.Random.getRandomBuffer(128 / 8)
  return aescbc.encryptCipherkey(data, secret, ivbuf)
})

zip(ciphertexts, secrets).forEach(([ciphertext, secret]) => {
  console.log(aescbc.decryptCipherkey(ciphertext, secret).toString())
})
