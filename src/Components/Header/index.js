import Cookies from 'js-cookie'
import {Link, withRouter} from 'react-router-dom'

import './index.css'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="nav-container">
      <div className="nav-content-desktop">
        <Link to="/" className="link-item">
          <img
            src="https://res.cloudinary.com/dzlwkon9z/image/upload/c_thumb,w_200,g_face/v1735744432/Group_8004_jtkb4c.png"
            alt="website logo"
            className="header-logo"
          />
        </Link>

        <button
          type="button"
          className="logout-button-desktop"
          onClick={onClickLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  )
}
export default withRouter(Header)
