import React from 'react'
import bitcore from 'bitcore-lib'
import { connect } from 'react-redux'

class AddressStatus extends React.Component {
  static propTypes = {
    address: React.PropTypes.string.isRequired,
    status: React.PropTypes.object
  }

  render() {
    const { address, status } = this.props
    let icon, label

    if (!status) {
      icon = 'refresh'
      label = 'Pending'
    } else if (status.released) {
      icon = 'eye-open'
      label = 'Released'
    } else {
      icon = 'eye-close'

      let balance = bitcore.Unit.fromSatoshis(status.unconfirmedBalance).toBTC()
      label = `Received (${balance} BTC)`
    }

    return (
      <span>
        <i className={'glyphicon glyphicon-' + icon} /> {label}
      </span>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const addresses = state.addresses || {}
  return { status: addresses[ownProps.address] }
}

export default connect(mapStateToProps)(AddressStatus)
