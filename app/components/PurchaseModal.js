import React from 'react'
import { connect } from 'react-redux'
import Modal from './Modal'
import { closeModal } from '../actions'

function QRCode({ address }) {
  var qr = require('qr-image')
  var qr_svg = qr.imageSync('bitcoin:' + address, { type: 'svg' })

  return <svg width="150" height="150" dangerouslySetInnerHTML={{__html: qr_svg}} />
}

QRCode.propTypes = { address: React.PropTypes.string.isRequired }

class PurchaseModal extends React.PureComponent {
  static propTypes = {
    chunk: React.PropTypes.object.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    onConfirm: React.PropTypes.func,
  }

  handleClose = () => {
    this.props.dispatch(closeModal())
  }

  handleConfirm = () => {
    this.props.onConfirm()
  }

  getActions() {
    return [
      <button type="button" key="1" className="btn btn-default" onClick={this.handleClose}>Close</button>,
      <button type="button" key="2" className="btn btn-primary" onClick={this.handleConfirm}>Confirm</button>,
    ]
  }

  render() {
    let { chunk } = this.props

    return (
      <Modal title="Purchase chunk" actions={this.getActions()}>
        <p>You are about to purchase chunk <code>{chunk.address}</code>.</p>

        <p className="text-danger"><strong>IMPORTANT:</strong> you will only receive the encryption key once the seller withdraws from this address.</p>

        <div className="text-center">
          <QRCode address={chunk.address} />
          <br />
          <small>Address: <span className="selectable">{chunk.address}</span></small>
        </div>
      </Modal>
    )
  }
}

export default connect()(PurchaseModal)
