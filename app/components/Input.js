import React from 'React'

class Input extends React.Component {
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
    let {
      validators,
      className,
      onError,
      onValid,
      ...props
    } = this.props

    className = className || 'form-control'

    return (
      <div className={'form-group' + (this.state.errors.length > 0 ? ' has-error': '')}>
        <input className={className} {...props} onChange={this.handleChange} />
      </div>
    )
  }
}

export default Input
