import React from 'react'
import omit from 'lodash/omit'

class Input extends React.PureComponent {
  static propTypes = {
    className: React.PropTypes.string,
    validators: React.PropTypes.arrayOf(
      React.PropTypes.func
    ),
    onError: React.PropTypes.func,
    onValid: React.PropTypes.func,
    onChange: React.PropTypes.func,
  }

  static defaultProps = {
    validators: []
  }

  constructor(props) {
    super(props)
    this.state = { errors: [] }
  }

  handleChange = (e) => {
    const { validators } = this.props
    const value = e.target.value
    const errors = []

    for (var validator of validators) {
      try {
        validator(value)
      } catch (e) {
        errors.push(e)
      }
    }

    this.setState({ errors })

    if (errors.length > 0) {
      this.props.onError && this.props.onError(errors)
    } else {
      this.props.onValid && this.props.onValid(value)
    }

    if (this.props.onChange) {
      this.props.onChange(e)
    }
  }
  
  render() {
    const props = omit(this.props, ['validators', 'onError', 'onValid'])

    return (
      <div className={'form-group' + (this.state.errors.length > 0 ? ' has-error': '')}>
        <input {...props} className="form-control" onChange={this.handleChange} />
      </div>
    )
  }
}

export default Input
