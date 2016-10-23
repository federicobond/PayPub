import React from 'react'

class Header extends React.Component {
  static propTypes = {
    title: React.PropTypes.string.isRequired
  }

  render() {
    const { title, children } = this.props
    return (
      <div className="page-header">
        <h1 className="pull-left">{title}</h1>
        <div className="page-actions pull-right">
          {children}
        </div>
      </div>
    )
  }
}

export default Header
