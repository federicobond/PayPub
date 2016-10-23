import React from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { Link, hashHistory as history } from 'react-router'
import { saveRelease, exportRelease, syncAddresses, withdrawChunk } from '../actions'
import AddressStatus from '../components/AddressStatus'
import Header from '../components/Header'


class Manage extends React.Component {
  constructor(props) {
    super(props)
    this.timer = null
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

  handleSave = (e) => {
    this.props.dispatch(saveRelease(this.props.payload))
  }

  handleExport = (e) => {
    this.props.dispatch(exportRelease(this.props.payload))
  }

  render() {
    return (
      <div>
        <Header title="Manage Release">
          <Link className="btn btn-default" to="/">Home</Link>
          &nbsp;
          <button className="btn btn-default" onClick={this.handleSave}>Save</button>
          &nbsp;
          <button className="btn btn-default" onClick={this.handleExport}>Export</button>
        </Header>
        {this.renderChunks()}
      </div>
    )
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

  handleWithdraw(chunk) {
    this.props.dispatch(withdrawChunk(chunk))
  }

  renderChunk(chunk) {
    const info = this.props.addresses[chunk.address]
    const withdrawDisabled = !info || info.balance === 0

    return (
      <tr key={chunk.address}>
        <td>
          <h5 className="selectable">{chunk.address}</h5>
          <small className="text-muted">{chunk.filename}</small>
        </td>
        <td><AddressStatus address={chunk.address} /></td>
        <td>
          <button
              className={classNames('btn btn-sm', withdrawDisabled ? 'btn-default' : 'btn-primary')}
              onClick={() => this.handleWithdraw(chunk)}
              disabled={withdrawDisabled}>
            Withdraw
          </button>
        </td>
      </tr>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    addresses: state.addresses,
    files: state.files,
    payload: state.payload,
  }
}

export default connect(mapStateToProps)(Manage)
