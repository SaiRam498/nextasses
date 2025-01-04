import {Component} from 'react'

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
              alt="Assessment Illustration"
              className="assessment-image"
            />
          </div>
          <div className="instructions-container">
            <h2>Instructions</h2>
            <ul>
              <li>Total Questions: 10</li>
              <li>Types of Questions: MCQs</li>
              <li>Duration: 10 Mins</li>
              <li>Marking Scheme: Every correct response gets 1 mark</li>
              <li>
                All progress will be lost if you reload during the assessment.
              </li>
            </ul>
            <button className="start-button">Start Assessment</button>
          </div>
        </div>
      </>
    )
  }
}

export default Home
