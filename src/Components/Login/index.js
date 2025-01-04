import {Component} from 'react'

import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    showPassword: false,
    showSubmitError: false,
    errorMsg: '',
  }

  onchangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onClickShowPassword = () => {
    this.setState(prevState => ({
      showPassword: !prevState.showPassword,
    }))
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitError = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  submitLoginForm = async event => {
    event.preventDefault()
    const {username, password} = this.state

    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'

    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitError(data.error_msg)
    }
  }

  render() {
    const {showPassword, errorMsg, showSubmitError} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-main-container">
        <div className="login-container">
          <div className="logo">
            <img
              src="https://res.cloudinary.com/dzlwkon9z/image/upload/c_thumb,w_200,g_face/v1735613791/Group_8005_cba17r.png"
              alt="login website logo"
            />
          </div>
          <form className="form-container" onSubmit={this.submitLoginForm}>
            <div>
              <label htmlFor="username">USERNAME</label>
              <input
                type="text"
                onChange={this.onchangeUsername}
                id="username"
                placeholder="Enter your username"
              />
            </div>
            <div>
              <label htmlFor="password">PASSWORD</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Enter your password"
                onChange={this.onChangePassword}
              />
            </div>
            <div>
              <input
                type="checkbox"
                id="show-password"
                onChange={this.onClickShowPassword}
              />
              <label htmlFor="show-password">Show Password</label>
            </div>
            <button className="button-lg" type="submit">
              Login
            </button>
            {showSubmitError && <p>*{errorMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default Login
