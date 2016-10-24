import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router, IndexRoute, Route, hashHistory as history } from 'react-router'
import bitcore from 'bitcore-lib'

import App from './containers/App'
import Create from './routes/Create'
import Index from './routes/Index'
import Manage from './routes/Manage'
import Show from './routes/Show'
import store from './store'
import { updateLocation } from './actions'

bitcore.Networks.defaultNetwork = bitcore.Networks.testnet

require('./listeners')
require('./style.less')

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={Index} />
        <Route path="create" component={Create} />
        <Route path="show" component={Show} />
        <Route path="manage" component={Manage} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('content')
)

history.listen(location => store.dispatch(updateLocation(location)))

require('devtron').install()
