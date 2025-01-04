import {Route, Switch, Redirect} from 'react-router-dom'

import Login from './Components/Login'
import Home from './Components/Home'
import Assessment from './Components/Assessment'
import ProtectedRoute from './Components/ProtectedRoute'
import './App.css'

const App = () => (
  <Switch>
    <Route exact path="/login" component={Login} />
    <Route exact path="/assessment" component={Assessment} />
    <ProtectedRoute exact path="/" component={Home} />
  </Switch>
)

export default App
