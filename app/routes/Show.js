import React from 'react'
import { connect } from 'react-redux'
import { Link, hashHistory as history } from 'react-router'
import AddressStatus from '../components/AddressStatus'
import Header from '../components/Header'
import { decryptChunk, purchaseChunk, syncAddresses } from '../actions'

class Show extends React.PureComponent {
  static propTypes = {
    addresses: React.PropTypes.object,
    dispatch: React.PropTypes.func.isRequired,
    payload: React.PropTypes.object,
  }

  componentWillMount() {
    if (!this.props.payload) {
      history.push('/')
    }
  }

  componentDidMount() {
    const { payload } = this.props

    if (payload) {
      this.props.dispatch(syncAddresses(this.getAddresses()))
    }

    this.timer = window.setInterval(() => {
      this.props.dispatch(syncAddresses(this.getAddresses()))
    }, 10000)
  }

  componentWillUnmount() {
    window.clearInterval(this.timer)
  }

  getAddresses() {
    const { payload } = this.props
    return payload.chunks.map(chunk => chunk.address)
  }

  handlePurchase(chunk) {
    this.props.dispatch(purchaseChunk(chunk))
  }

  handleDecrypt(chunk) {
    this.props.dispatch(decryptChunk(chunk))
  }

  renderChunks() {
    const { payload } = this.props

    if (!payload)
      return null

    return (
      <div className="table-container">
        <table className="table">
          <tbody>
            {payload.chunks.map(this.renderChunk.bind(this))}
          </tbody>
        </table>
      </div>
    )
  }

  renderAction(chunk) {
    const info = this.props.addresses[chunk.address]

    if (!info || !info.released) {
      return (
        <button
            className="btn btn-primary btn-sm"
            onClick={() => this.handlePurchase(chunk)}>
          Purchase
        </button>
      )
    } else {
      return (
        <button
            className="btn btn-primary btn-sm"
            onClick={() => this.handleDecrypt(chunk)}>
          Decrypt
        </button>
      )
    }
  }

  renderChunk(chunk) {
    return (
      <tr key={chunk.address}>
        <td>
          <h5 className="selectable">{chunk.address}</h5>
        </td>
        <td><AddressStatus address={chunk.address} /></td>
        <td>
          {this.renderAction(chunk)}
        </td>
      </tr>
    )
  }

  render() {
    return (
      <div>
        <Header title="Release">
          <Link className="btn btn-default" to="/">Home</Link>
        </Header>
        {this.renderChunks()}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    addresses: state.addresses,
    payload: state.payload,
  }
}

export default connect(mapStateToProps)(Show)
