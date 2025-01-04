import {Link} from 'react-router-dom'

import './index.css'

const NotFound = () => (
  <div className="not-found-container">
    <h1>Page Not Found</h1>
    <img
      src="https://res.cloudinary.com/dzlwkon9z/image/upload/c_thumb,w_200,g_face/v1736013047/Group_7504_cuiihb.png"
      alt="not found"
    />

    <p className="description">
      we are sorry, the page you requested could not be found Please go back to
      the homepage.
    </p>
    <Link to="/">
      <button type="button" className="go-home-btn">
        Go to Home
      </button>
    </Link>
  </div>
)

export default NotFound
