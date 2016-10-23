import React from 'react'
import { connect } from 'react-redux'

class StatusBar extends React.Component {
  static propTypes = {
    sync: React.PropTypes.object
  }

  render() {
    const { sync } = this.props

    let label
    if (!this.props.sync) {
      label = 'Syncing...'
    } else {
      // label = JSON.stringify(this.props.sync)
      label = `Sync: ${sync.syncPercentage}%. Current height: ${sync.blockChainHeight}`
    }
    
    return (
      <footer className="footer">
        <small className="text-muted">{label}</small>
      </footer>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    sync: state.sync,
  }
}

export default connect(mapStateToProps)(StatusBar)
