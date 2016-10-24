const ipc = require('electron').ipcRenderer
const aescbc = require('bitcore-ecies/lib/aescbc')

import bitcore from 'bitcore-lib'
import { hashHistory as history } from 'react-router'
import { createAction } from 'redux-actions'
import insight from '../insight'

const FEE_IN_SATOSHIS = 10000

export const updateLocation = createAction('UPDATE_LOCATION')

export const openFileDialog = createAction('OPEN_FILE_DIALOG', () => {
  ipc.send('open-file-dialog', { multi: true })
})

export const filesOpened = createAction('FILES_OPENED')

export const createRelease = ({ title }) => {
  return (dispatch, getState) => {
    const files = getState().files
    // get file contents
    const payload = {
      title,
      private: true,
      chunks: files.map(path => {

        const content = new Buffer(path) // stub
        const hash = bitcore.crypto.Hash.sha256(content)
        const privateKey = bitcore.PrivateKey(hash)
        const publicKey = privateKey.publicKey
        const address = publicKey.toAddress()
        const secret = bitcore.crypto.Hash.sha256(publicKey.toBuffer())

        const ivbuf = bitcore.crypto.Random.getRandomBuffer(128 / 8)
        const ciphertext = aescbc.encryptCipherkey(content, secret, ivbuf)

        return {
          filename: path.split('/').pop(),
          address: address.toString(),
          ciphertext: ciphertext.toString('base64'),
          privateKey: privateKey.toWIF(),
        }
      })
    }

    dispatch({ type: 'CREATE_RELEASE', payload: payload })

    setTimeout(() => history.push('/manage'), 100)
  }
}


export const saveRelease = createAction('SAVE_RELEASE', (payload) => {
  ipc.once('selected-save-file', function(event, path) {
    if (!path) {
      return
    }

    ipc.send('save-release', path, JSON.stringify(payload))
  })

  ipc.send('save-file-dialog')
})

export const loadRelease = createAction('LOAD_RELEASE', () => {
  ipc.once('selected-files', function(event, paths) {
    ipc.send('load-release', paths[0])
  })

  ipc.send('open-file-dialog', { multi: false })
})

export const loadedRelease = createAction('LOADED_RELEASE', (payload) => {
  setImmediate(function() {
    if (payload.private) {
      history.push('/manage')
    } else {
      history.push('/show')
    }
  })

  return payload
})

export const exportRelease = createAction('EXPORT_RELEASE', (payload) => {
  payload = {
    ...payload,
    private: false,
    chunks: payload.chunks.map((chunk) => {
      return {
        address: chunk.address,
        ciphertext: chunk.ciphertext,
      }
    })
  }

  ipc.once('selected-save-file', function(event, path) {
    if (!path) {
      return
    }

    ipc.send('save-release', path, JSON.stringify(payload))
  })

  ipc.send('save-file-dialog')
})

export const sync = createAction('SYNC')

export const syncAddresses = createAction('SYNC_ADDRESSES', (addresses) => {
  ipc.send('sync-addresses', addresses)
  return addresses
})

export const syncedAddress = createAction('SYNCED_ADDRESS')

export const openModal = createAction('OPEN_MODAL', (component, props) => {
  return { component, props }
})

export const closeModal = createAction('CLOSE_MODAL')

export const withdrawChunk = (chunk) => {
  return (dispatch, getState) => {
    dispatch(openModal('WithdrawModal', { chunk, onConfirm }))

    function onConfirm(address) {
      dispatch(closeModal())

      const info = getState().addresses[chunk.address]

      insight.getUnspentUtxos(chunk.address, function(err, utxos) {
        if (err) throw err

        address = new bitcore.Address(address)
        const privateKey = bitcore.PrivateKey.fromWIF(chunk.privateKey)
        const tx = new bitcore.Transaction()
          .from(utxos)
          .to(address, info.balance - FEE_IN_SATOSHIS)
          .sign(privateKey)

        insight.broadcast(tx, function(err) {
          if (err) throw err
        })
      })
    }
  }
}

export const purchaseChunk = (chunk) => {
  return (dispatch) => {
    dispatch(openModal('PurchaseModal', { chunk, onConfirm }))

    function onConfirm() {
      dispatch(closeModal())
    }
  }
}

export const decryptChunk = (chunk) => {
  return (dispatch) => {
    ipc.once('selected-save-file', function(event, path) {
      if (!path) {
        return
      }

      insight.addressTxs(chunk.address, function(err, data) {
        // console.log('Find spending transactions, could be after several pages')
        // console.log(data.pagesTotal)

        let publicKey

        for (var tx of data.txs) {
          const script = new bitcore.Script(tx.vin[0].scriptSig.hex)
          if (script.chunks.length > 1) {
            publicKey = new bitcore.PublicKey(script.chunks[1].buf)
            break
          }
        }

        if (publicKey.toAddress().toString() != chunk.address) {
          throw new Error('found invalid address')
        }

        const secret = bitcore.crypto.Hash.sha256(publicKey.toBuffer())
        const plaintext = aescbc.decryptCipherkey(new Buffer(chunk.ciphertext, 'base64'), secret)
        // console.log(plaintext.toString())

        dispatch(decryptedFile(chunk, plaintext))
      })

      // ipc.send('save-release', path)
    })

    ipc.send('save-file-dialog')
  }
}

export const decryptedFile = createAction('DECRYPTED_FILE')
