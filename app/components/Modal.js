import React from 'react'
import { connect } from 'react-redux'
import { closeModal } from '../actions'

class Modal extends React.Component {
  static propTypes = {
    title: React.PropTypes.string.isRequired,
    actions: React.PropTypes.array,
  }

  constructor(props) {
    super(props)

    this.escapeKeyListener = (e) => {
      if (event.key === 'Escape' || event.keyCode === 27) {
        this.handleClose()
      }
    }
  }

  handleClose = () => {
    this.props.dispatch(closeModal())
  }

  componentDidMount() {
    document.addEventListener('keydown', this.escapeKeyListener)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.escapeKeyListener)
  }

  render() {
    return (
      <div className="modal show" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" aria-label="Close" onClick={this.handleClose}>
                <span aria-hidden="true">&times;</span>
              </button>
              <h4 className="modal-title">{this.props.title}</h4>
            </div>
            <div className="modal-body">
              {this.props.children}
            </div>
            {this.props.actions && <div className="modal-footer">{this.props.actions}</div>}
          </div>
        </div>
      </div>
    )
  }
}

export default connect()(Modal)
