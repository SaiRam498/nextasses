import {Component} from 'react'

import FailureView from '../FailureView'
import LoaderView from '../LoaderView'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Assessment extends Component {
  state = {
    questions: [],
    currentQuestionIndex: 0,
    answeredCount: 0,
    unansweredCount: 0,
    min: 10,
    isTimerRunning: false,
    sec: 0,
    apiStatus: apiStatusConstants.initial,
    selectedOptions: {},
    timevalue: false,
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
    const {min, sec, timevalue} = this.state
    const isTimerCompleted = sec === min * 60
    if (isTimerCompleted) {
      this.clearTimerInterval()
      this.setState({isTimerRunning: false})
      this.handleSubmit(timevalue)
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
      this.intervalId = setInterval(this.incrementTimeElapsedInSeconds, 1000)
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
      this.handleSubmit()
    }
  }

  // questions

  fetchQuestions = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const questionsApiUrl = 'https://apis.ccbp.in/assess/questions'

    const response = await fetch(questionsApiUrl)
    if (response.ok) {
      const data = await response.json()
      const questionsWithAnsweredStatus = data.questions.map(question => ({
        ...question,
        selectedOption: null,
        answered: false, // Add an answered flag
      }))
      this.setState({
        questions: questionsWithAnsweredStatus,
        unansweredCount: data.total,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  handleOptionSelect = (questionId, optionId) => {
    const {questions, answeredCount, unansweredCount} = this.state
    const updatedQuestions = questions.map(question => {
      if (question.id === questionId) {
        const wasAnswered = question.answered
        return {...question, selectedOption: optionId, answered: true}
      }
      return question
    })
    const isFirstTimeAnswering = !questions.find(q => q.id === questionId)
      .answered
    this.setState({
      questions: updatedQuestions,
      selectedOptions: {...this.state.selectedOptions, [questionId]: optionId},
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

  handleSubmit = timevalue => {
    const {questions, selectedOptions, min, sec} = this.state
    let score = 0
    const totalSeconds = min * 60
    const remainingTime = totalSeconds - sec
    const completedTime = totalSeconds - remainingTime
    console.log(selectedOptions)
    questions.forEach(question => {
      const correctOptionId = question.options.find(
        option => option.is_correct === 'true',
      ).id
      if (selectedOptions[question.id] === correctOptionId) {
        score++
      }
    })

    this.props.history.push('/results', {score, completedTime, timevalue})
  }

  renderOptions = question => {
    const {selectedOptions} = this.state

    switch (question.options_type) {
      case 'DEFAULT':
        return (
          <ul>
            {question.options.map(option => (
              <li
                className="li-container"
                key={option.id}
                onClick={() => this.handleOptionSelect(question.id, option.id)}
                style={{
                  backgroundColor:
                    selectedOptions[question.id] === option.id
                      ? 'blue'
                      : 'lightblue',
                }}
              >
                {option.text}
              </li>
            ))}
          </ul>
        )

      case 'IMAGE':
        return (
          <li>
            {question.options.map(option => (
              <button
                onClick={() => this.handleOptionSelect(question.id, option.id)}
              >
                <img
                  className="img-h"
                  key={option.id}
                  src={option.image_url}
                  alt={option.text}
                  style={{
                    border:
                      selectedOptions[question.id] === option.id
                        ? '2px solid blue'
                        : 'none',
                  }}
                />
              </button>
            ))}
          </li>
        )

      case 'SINGLE_SELECT':
        return (
          <div>
            <select
              onChange={event =>
                this.handleOptionSelect(question.id, event.target.value)
              }
              value={selectedOptions[question.id] || ''}
            >
              {question.options.map(option => (
                <option key={option.id} value={option.id}>
                  {option.text}
                </option>
              ))}
            </select>
          </div>
        )

      default:
        return null
    }
  }

  onClickRetry = () => {
    this.getTrendingMovies()
  }

  renderLoaderView = () => <LoaderView />

  renderFailureView = () => <FailureView onClickRetry={this.fetchQuestions} />

  renderSuccessView = () => {
    const {
      questions,
      currentQuestionIndex,

      answeredCount,
      unansweredCount,
    } = this.state
    const currentQuestion = questions[currentQuestionIndex]
    return (
      <div className="question-container-main">
        <div className="question-container-sub">
          <p className="heading-question">{currentQuestion.question_text}</p>
          <hr className="hr-question" />
          <ul className="ul-question">{this.renderOptions(currentQuestion)}</ul>
          {currentQuestionIndex !== questions.length - 1 && (
            <button onClick={this.handleNextQuestion}>Next Question</button>
          )}
        </div>
        <div className="timer-container">
          <div>
            <div className="heading-timer">
              <p className="h1-timer">Time Left</p>
              <p className="h1-timer">
                00:{this.getElapsedSecondsInTimeFormat()}
              </p>
            </div>
            <div className="timer-container-sub">
              <div className="timer-small-cont">
                <p className="p-timer p-bg">{answeredCount}</p>
                <p className="p-heading">Answered Questions</p>
              </div>

              <div className="timer-small-cont">
                <p className="p-timer">{unansweredCount}</p>
                <p className="p-heading">Unanswered Questions</p>
              </div>
            </div>
            <hr className="hr-q" />
            <div>
              <h1 className="h-q">Questions ({questions.length})</h1>
              <div>
                {questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => this.handleQuestionClick(index)}
                    style={{
                      width: '40px',
                      height: '40px',
                      margin: '5px',
                      color: 'black',
                      background:
                        currentQuestionIndex === index ? 'lightgreen' : 'white',
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
            <button type="button" onClick={this.onStartOrPauseTimer}>
              Submit Assessment
            </button>
          </div>
        </div>
      </div>
    )
  }

  renderHomePage = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderHomePage()}
      </>
    )
  }
}

export default Assessment
