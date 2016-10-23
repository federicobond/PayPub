import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import StatusBar from '../components/StatusBar'
import * as modals from '../modals'

class App extends React.Component {
  renderModal() {
    if (this.props.modal) {
      const { component, props } = this.props.modal
      const Component = modals[component]

      if (!Component) throw new Error('unrecognized modal: ' + component)

      return <Component {...props} />
    }
  }

  render() {
    const modal = this.renderModal()

    return (
      <div>
        {modal}
        <div className="app">
          {this.props.children}
        </div>
        <StatusBar />
        {modal && <div className="modal-backdrop fade in" />}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.loading,
    modal: state.modal,
  }
}

export default connect(mapStateToProps)(App)
