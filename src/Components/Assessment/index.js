import {Component} from 'react'

import Header from '../Header'
import './index.css'

class Assessment extends Component {
  state = {
    questions: [],
    currentQuestionIndex: 0,
    answeredCount: 0,
    unansweredCount: 0,
    min: 10,
    isTimerRunning: false,
    sec: 0,
    loading: true,
    error: false,
  }

  componentDidMount() {
    this.fetchQuestions()
    this.timer()
  }

  componentWillUnmount() {
    this.clearTimerInterval()
  }

  clearTimerInterval = () => clearInterval(this.intervalId)

  // Timer functinality

  incrementTimeElapsedInSeconds = () => {
    const {min, sec} = this.state
    const isTimerCompleted = sec === min * 60
    if (isTimerCompleted) {
      this.clearTimerInterval()
      this.setState({isTimerRunning: false})
      console.log('hhhhhhhhh')
    } else {
      this.setState(prevState => ({sec: prevState.sec + 1}))
    }
  }

  timer = () => {
    const {sec, min, isTimerRunning} = this.state
    const isTimerCompleted = sec === min * 60
    if (isTimerCompleted) {
      this.setState({sec: 0})
    }
    if (isTimerRunning) {
      this.clearTimerInterval()
    } else {
      this.intervalId = setInterval(this.incrementTimeElapsedInSeconds, 100)
    }
    this.setState(prevState => ({isTimerRunning: !prevState.isTimerRunning}))
  }

  getElapsedSecondsInTimeFormat = () => {
    const {min, sec} = this.state
    const totalRemainingSeconds = min * 60 - sec
    const minutes = Math.floor(totalRemainingSeconds / 60)
    const seconds = Math.floor(totalRemainingSeconds % 60)
    const stringifiedMinutes = minutes > 9 ? minutes : `0${minutes}`
    const stringifiedSeconds = seconds > 9 ? seconds : `0${seconds}`
    return `${stringifiedMinutes}:${stringifiedSeconds}`
  }

  onStartOrPauseTimer = () => {
    const {isTimerRunning} = this.state
    if (isTimerRunning) {
      this.clearTimerInterval()
      this.setState({isTimerRunning: false})
      console.log('hhhhh')
    }
  }

  // questions

  fetchQuestions = () => {
    const questionsApiUrl = 'https://apis.ccbp.in/assess/questions' // Replace with your API URL

    fetch(questionsApiUrl)
      .then(response => response.json())
      .then(data => {
        const questionsWithAnsweredStatus = data.questions.map(question => ({
          ...question,
          selectedOption: null,
          answered: false, // Add an answered flag
        }))
        this.setState({
          questions: questionsWithAnsweredStatus,
          unansweredCount: data.total,
          loading: false,
        })
      })
      .catch(() => this.setState({error: true}))
  }

  handleOptionSelect = (questionId, optionId) => {
    const {questions, answeredCount, unansweredCount} = this.state

    const updatedQuestions = questions.map(question => {
      if (question.id === questionId) {
        const wasAnswered = question.answered

        return {
          ...question,
          selectedOption: optionId,
          answered: true, // Mark as answered
        }
      }
      return question
    })

    const isFirstTimeAnswering = !questions.find(q => q.id === questionId)
      .answered

    this.setState({
      questions: updatedQuestions,
      answeredCount: isFirstTimeAnswering ? answeredCount + 1 : answeredCount,
      unansweredCount: isFirstTimeAnswering
        ? unansweredCount - 1
        : unansweredCount,
    })
  }

  handleNextQuestion = () => {
    this.setState(prevState => ({
      currentQuestionIndex: prevState.currentQuestionIndex + 1,
    }))
  }

  handleQuestionClick = index => {
    this.setState({currentQuestionIndex: index})
  }

  handleSubmit = () => {
    this.props.history.push('/results', {
      score: this.state.answeredCount,
      timeTaken: 600 - this.state.timer,
    })
  }

  render() {
    const {
      questions,
      currentQuestionIndex,
      timer,
      answeredCount,
      unansweredCount,
      loading,
      error,
    } = this.state
    console.log(questions)
    if (loading) {
      return <div>Loading...</div>
    }

    if (error) {
      return (
        <div>
          <h1>Failed to load questions</h1>
          <button onClick={this.fetchQuestions}>Retry</button>
        </div>
      )
    }

    const currentQuestion = questions[currentQuestionIndex]

    return (
      <>
        <Header />
        <div className="question-container-main">
          <div className="question-container-sub">
            <h1 className="heading-question">
              {currentQuestion.question_text}
            </h1>
            <hr className="hr-question" />
            <ul className="ul-question">
              {currentQuestion.options.map(option => (
                <li
                  className="li-container"
                  key={option.id}
                  onClick={() =>
                    this.handleOptionSelect(currentQuestion.id, option.id)
                  }
                  style={{
                    cursor: 'pointer',
                    background:
                      currentQuestion.selectedOption === option.id &&
                      'lightblue',
                  }}
                >
                  {option.text}
                </li>
              ))}
            </ul>
            {currentQuestionIndex === questions.length - 1 ? (
              <button onClick={this.handleSubmit}>Submit Assessment</button>
            ) : (
              <button onClick={this.handleNextQuestion}>Next Question</button>
            )}
          </div>
          <div className="timer-container">
            <div>
              <div className="heading-timer">
                <h1 className="h1-timer">Time Left</h1>
                <h1 className="h1-timer">
                  00:{this.getElapsedSecondsInTimeFormat()}
                </h1>
              </div>
              <div className="timer-container-sub">
                <p>Answered: {answeredCount}</p>
                <p>Unanswered: {unansweredCount}</p>
              </div>

              <div>
                <h2>Questions</h2>
                <div>
                  {questions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => this.handleQuestionClick(index)}
                      style={{
                        width: '40px',
                        height: '40px',
                        margin: '5px',
                        background:
                          currentQuestionIndex === index
                            ? 'lightgreen'
                            : 'white',
                        border: '1px solid black',
                        cursor: 'pointer',
                      }}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <button type="button">Submit Assessment</button>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default Assessment
