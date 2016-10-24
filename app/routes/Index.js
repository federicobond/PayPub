import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { loadRelease } from '../actions'

class Index extends React.PureComponent {
  static propTypes = {
    dispatch: React.PropTypes.func.isRequired
  }

  handleLoad = () => {
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
}

export default connect()(Index)
