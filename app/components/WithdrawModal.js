import React from 'react'
import bitcore from 'bitcore-lib'
import { connect } from 'react-redux'
import Input from './Input'
import Modal from './Modal'
import { closeModal } from '../actions'

function addressValidator(value) {
  try {
    new bitcore.Address(value)
  } catch (e) {
    throw new Error('invalid address: ' + value)
  }
}


class WithdrawModal extends React.Component {
  static propTypes = {
    chunk: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)
    this.state = { address: '', error: true }
  }

  handleClose = () => {
    this.props.dispatch(closeModal())
  }

  handleConfirm = () => {
    this.props.onConfirm(this.state.address)
  }

  render() {
    let { chunk, amount } = this.props

    amount = bitcore.Unit.fromSatoshis(amount).toBTC()

    return (
      <Modal title="Withdraw funds" actions={this.getActions()}>
        <p>You are about to withdraw <strong>{amount} BTC</strong> from <code>{chunk.address}</code>.</p>

        <p className="text-danger"><strong>IMPORTANT:</strong> this will permanently and irreversibly reveal the encription key for this file. Make sure you are satisfied with the balance before proceeding.</p>

        <p>Please enter a destination address:</p>

        <Input
          type="text" value={this.state.address}
          onChange={(e) => this.setState({ address: e.target.value })}
          onError={(e) => this.setState({ error: true })}
          onValid={(e) => this.setState({ error: false })}
          validators={[addressValidator]}
        />
      </Modal>
    )
  }

  getActions() {
    return [
      <button type="button" key="1" className="btn btn-default" onClick={this.handleClose}>Close</button>,
      <button type="button" key="2" className="btn btn-primary" onClick={this.handleConfirm} disabled={this.state.error}>Confirm</button>,
    ]
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    amount: state.addresses[ownProps.chunk.address].balance
  }
}

export default connect(mapStateToProps)(WithdrawModal)
