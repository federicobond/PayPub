import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { openFileDialog, createRelease } from '../actions'

class Create extends React.PureComponent {
  static propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    files: React.PropTypes.arrayOf(
      React.PropTypes.string
    )
  }

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

  renderFiles() {
    const { files } = this.props

    if (!files)
      return null

    return (
      <ul className="list-group">
        {files.map(({ path }) => <li className="list-group-item" key={path}>{path.split('/').pop()}</li>)}
      </ul>
    )
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
}

const mapStateToProps = (state) => {
  return {
    files: state.files
  }
}

export default connect(mapStateToProps)(Create)
