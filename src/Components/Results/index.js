import React from 'react'
import {withRouter, Link} from 'react-router-dom'

import Header from '../Header'

class Results extends React.Component {
  handleReattempt = () => {
    this.props.history.push('/assessment')
  }

  render() {
    const {score, completedTime, timevalue} = this.props.location.state || {
      score: 0,
      completedTime: 0,
      timevalue: false,
    }

    return (
      <>
        <Header />
        {timevalue ? (
          <div>
            <img
              src="https://res.cloudinary.com/dzlwkon9z/image/upload/c_thumb,w_200,g_face/v1736013476/Screenshot_2025-01-04_232651_kjif0z.png"
              alt="time up"
            />
            <h1>Time is up!</h1>
            <p>You did not complete the assessment within the time</p>

            <p>Your Score: {score}</p>
            <Link to="/assessment">
              <button onClick={this.handleReattempt}>Reattempt</button>
            </Link>
          </div>
        ) : (
          <div>
            <img
              src="https://res.cloudinary.com/dzlwkon9z/image/upload/c_thumb,w_200,g_face/v1736013459/Asset_2_1_kgvvg2.png"
              alt="submit"
            />
            <h1>Congrats! You completed the assessment.</h1>
            <p>Your Score: {score}</p>
            <p>
              Time Taken: 00:
              {Math.floor(completedTime / 60) < 10
                ? `0${Math.floor(completedTime / 60)}`
                : Math.floor(completedTime / 60)}
              :
              {completedTime % 60 < 10
                ? `0${completedTime % 60}`
                : completedTime % 60}
            </p>
            <Link to="/assessment">
              <button onClick={this.handleReattempt}>Reattempt</button>
            </Link>
          </div>
        )}
      </>
    )
  }
}

export default withRouter(Results)
