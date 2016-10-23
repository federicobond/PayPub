import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { hashHistory as history } from 'react-router'
import { openFileDialog, createRelease } from '../actions'

class Create extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      title: '',
      proofHeight: 0 
    }
  }

  handleChooseFiles = () => {
    this.props.dispatch(openFileDialog())
  }

  handleCreate = () => {
    this.props.dispatch(createRelease({
      title: this.state.title,
      proofHeight: this.state.proofHeight,
    }))
  }

  render() {
    return (
      <div className="container-narrow">
        <Link className="close" to="/">&times;</Link>

        <h1>Create a new release</h1>

        <div className="form-group">
          <label htmlFor="name">Title</label>
          <input
            type="text"
            id="title"
            className="form-control"
            placeholder="Title"
            value={this.state.title}
            onChange={(e) => this.setState({ title: e.target.value })}
          />
        </div>

        <hr />

        {this.renderFiles()}

        <div className="text-right">
          <button className="btn btn-primary" type="button" onClick={this.handleChooseFiles}>
            Choose files
          </button>
          &nbsp;
          <button className="btn btn-primary" type="button" onClick={this.handleCreate} disabled={!this.props.files}>
            Publish
          </button>
        </div>
      </div>
    )
  }

  renderFiles() {
    const { files } = this.props

    if (!files)
      return null

    return (
      <ul className="list-group">
        {files.map(path => <li className="list-group-item" key={path}>{path.split('/').pop()}</li>)}
      </ul>
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

export default connect(mapStateToProps)(Create)
