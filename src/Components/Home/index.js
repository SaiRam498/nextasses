import {Component} from 'react'

import {Link} from 'react-router-dom'
import Header from '../Header'

import './index.css'

class Home extends Component {
  render() {
    return (
      <>
        <Header />
        <div className="assessment-container">
          <div className="image-container">
            <img
              src="https://res.cloudinary.com/dzlwkon9z/image/upload/c_thumb,w_200,g_face/v1735745248/Group_1_hwyalz.png"
              alt="assessment"
              className="assessment-image"
            />
          </div>
          <div className="instructions-container">
            <h1>Instructions</h1>
            <ol>
              <li>Total Questions: 10</li>
              <li>Types of Questions: MCQs</li>
              <li>Duration: 10 Mins</li>
              <li>Marking Scheme: Every Correct response, get 1 mark</li>
              <li>
                All the progress will be lost, if you reload during the
                assessment
              </li>
            </ol>
            <Link to="/assessment">
              <button className="start-button">Start Assessment</button>
            </Link>
          </div>
        </div>
      </>
    )
  }
}

export default Home
