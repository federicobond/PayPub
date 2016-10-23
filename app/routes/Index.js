import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { loadRelease } from '../actions'

class Index extends React.Component {
  handleLoad = (e) => {
    this.props.dispatch(loadRelease())
  }
  
  render() {
    return (
      <div className="container-narrow text-center">
        <div className="welcome">
          <h1>PayPub</h1>
          <p className="lead">Trustless payments for information<br /> publishing on Bitcoin</p>
          <div className="list-group">
            <Link className="list-group-item" to="/create">Create new release</Link>
            <a className="list-group-item" href="#" onClick={this.handleLoad}>Load release</a>
          </div>
          <small className="text-muted">
            Original idea by Peter Todd<br />
            Code by Federico Bond<br />
          </small>
        </div>
      </div>
    )
  }

  renderFiles() {
    const { files } = this.props

    if (!files)
      return null

    return (
      <div>
        <ul>{files.map(path => <li key={path}><code>{path}</code></li>)}</ul>
        <button className="btn btn-primary" type="button" onClick={this.handleCreate}>Publish</button>
        {this.renderChunks()}
        {this.renderPayload()}
      </div>
    )
  }

  renderChunks() {
    const { payload } = this.props

    if (!payload)
      return null

    return (
      <table className="table">
        <tbody>
          {payload.chunks.map(chunk => {
            return (
              <tr key={chunk.address}>
                <td>{chunk.public.address}</td>
                <td>{'pending'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }

  renderPayload() {
    const { payload } = this.props

    if (!payload)
      return null

    return (
      <pre>{JSON.stringify(payload, null, '  ')}</pre>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    files: state.files,
    payload: state.payload,
  }
}

export default connect(mapStateToProps)(Index)
