import {Route, Switch, Redirect} from 'react-router-dom'

import Login from './Components/Login'
import Home from './Components/Home'
import Assessment from './Components/Assessment'
import Result from './Components/Results'
import NotFound from './Components/NotFound'
import ProtectedRoute from './Components/ProtectedRoute'
import './App.css'

const App = () => (
  <Switch>
    <Route exact path="/login" component={Login} />
    <ProtectedRoute exact path="/" component={Home} />
    <ProtectedRoute exact path="/assessment" component={Assessment} />
    <ProtectedRoute exact path="/results" component={Result} />
    <Route exact path="/not-found" component={NotFound} />
    <Redirect to="/not-found" />
  </Switch>
)

export default App
