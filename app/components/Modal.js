import React from 'react'
import { connect } from 'react-redux'
import { closeModal } from '../actions'

class Modal extends React.PureComponent {
  static propTypes = {
    title: React.PropTypes.string.isRequired,
    actions: React.PropTypes.array,
    children: React.PropTypes.node,
    dispatch: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.escapeKeyListener = (e) => {
      if (e.key === 'Escape' || e.keyCode === 27) {
        this.handleClose()
      }
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.escapeKeyListener)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.escapeKeyListener)
  }

  handleClose = () => {
    this.props.dispatch(closeModal())
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
