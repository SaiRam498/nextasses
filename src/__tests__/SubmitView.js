import {createMemoryHistory} from 'history'
import {Router, BrowserRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {rest} from 'msw'
import {setupServer} from 'msw/node'

import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import App from '../App'

// #region

const resultsRoutePath = '/results'
const assessmentRoutePath = '/assessment'
const loginRoutePath = '/login'
const homeRoutePath = '/'
const questionsUrl = 'https://apis.ccbp.in/assess/questions'
const questionsResponse = {
  questions: [
    {
      id: '4c08f8e2-d69a-4cfa-9245-b76bdf3588d1',
      question_text: 'React JS is developed by?',
      options_type: 'DEFAULT',
      options: [
        {
          id: 'a8222953-e043-4873-abee-bc5dae13ee51',
          text: 'Facebook',
          is_correct: 'true',
        },
        {
          id: '0d5470e9-915e-400f-b495-930291046216',
          text: 'Twitter',
          is_correct: 'false',
        },
        {
          id: 'e0a41ff1-20a7-4f01-b1da-9024a866ce58',
          text: 'Microsoft',
          is_correct: 'false',
        },
        {
          id: '3883c078-d654-4873-ae61-538998324a3f',
          text: 'Google',
          is_correct: 'false',
        },
      ],
    },
    {
      id: '4b38d184-6c53-4fa8-9176-4bba17f6a639',
      question_text:
        'Which of the following outputs can be achieved if the CSS property justify-content with value space-between is applied to the flexbox container with the flex-direction row?',
      options_type: 'IMAGE',
      options: [
        {
          id: '60f03171-c496-4917-aff9-d8ff72d8f0db',
          text: 'flex start',
          image_url:
            'https://assets.ccbp.in/frontend/react-js/nxt-assess/flex-start-option-img.png',
          is_correct: 'false',
        },
        {
          id: 'ac160f7b-4ab3-41c7-ae53-b8e3c7bae941',
          text: 'flex center',
          image_url:
            'https://assets.ccbp.in/frontend/react-js/nxt-assess/flex-center-option-img.png',
          is_correct: 'false',
        },
        {
          id: '354c825a-3a02-401a-bcc0-3e649104fd1e',
          text: 'space between',
          image_url:
            'https://assets.ccbp.in/frontend/react-js/nxt-assess/space-between-option-img.png',
          is_correct: 'true',
        },
        {
          id: 'c52215cd-3cd3-4cae-b4c1-18182a4099b9',
          text: 'flex end',
          image_url:
            'https://assets.ccbp.in/frontend/react-js/nxt-assess/flex-end-option-img.png',
          is_correct: 'false',
        },
      ],
    },
    {
      id: '68c01ea3-0fb2-4c79-bffd-d3dd90ecbf2f',
      question_text:
        'Which of the following is used to initialize the state in React class component?',
      options_type: 'SINGLE_SELECT',
      options: [
        {
          id: '784065c5-87be-4d2f-8218-ef974a6b6aba',
          text: 'constructor',
          is_correct: 'true',
        },
        {
          id: 'c57e6bc3-0e10-4132-859b-77afdaa34ed2',
          text: 'None of the given options',
          is_correct: 'false',
        },
        {
          id: '26429cff-8de0-4810-8d86-510d5bd5f6cc',
          text: 'componentDidMount',
          is_correct: 'false',
        },
        {
          id: 'f9f95dca-51b9-49f0-bf64-167262e23a35',
          text: 'render',
          is_correct: 'false',
        },
        {
          id: '133b37c2-a17c-48cf-918a-4225c6bd81ac',
          text: 'componentWillUnmount',
          is_correct: 'false',
        },
      ],
    },
  ],
  total: 3,
}

const mockGetCookie = (returnToken = true) => {
  let mockedGetCookie
  if (returnToken) {
    mockedGetCookie = jest.fn(() => ({
      jwt_token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJhaHVsIiwiaWF0IjoxNjE5MDk0MjQxfQ.1i6BbQkQvtvpv72lHPNbl2JOZIB03uRcPbchYYCkL9o',
    }))
  } else {
    mockedGetCookie = jest.fn(() => undefined)
  }
  jest.spyOn(Cookies, 'get')
  Cookies.get = mockedGetCookie
}

const restoreGetCookieFns = () => {
  Cookies.get.mockRestore()
}
const mockRemoveCookie = () => {
  jest.spyOn(Cookies, 'remove')
  Cookies.remove = jest.fn()
}
const restoreRemoveCookieFns = () => {
  Cookies.remove.mockRestore()
}
let historyInstance
const mockHistoryReplace = instance => {
  jest.spyOn(instance, 'replace')
}
const rtlRender = (ui = <App />, path = '/') => {
  historyInstance = createMemoryHistory()
  historyInstance.push(path)
  render(<Router history={historyInstance}>{ui}</Router>)
  return {
    history: historyInstance,
  }
}

const handlers = [
  rest.get(questionsUrl, (req, res, ctx) => res(ctx.json(questionsResponse))),
]

const server = setupServer(...handlers)

const renderWithBrowserRouter = (ui, {route = resultsRoutePath} = {}) => {
  window.history.pushState({}, 'Test page', route)
  return render(ui, {wrapper: BrowserRouter})
}

// #endregion

describe(':::RJSCPU2OLA_TEST_SUITE_5:::Results Route Submit View tests', () => {
  beforeAll(() => {
    server.listen()
  })

  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    server.close()
  })

  afterEach(() => {
    server.resetHandlers()
  })

  it(':::RJSCPU2OLA_TEST_100:::When "/results" is provided as the URL by an unauthenticated user, then the page should be navigated to Login Route and should consist of an HTML button element with text content as "Login":::15:::', () => {
    mockGetCookie(false)
    renderWithBrowserRouter(<App />)
    expect(window.location.pathname).toBe(loginRoutePath)
    const buttonEl = screen.getByRole('button', {name: /Login/i, exact: false})
    expect(buttonEl).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_101:::Results Route should consist of HTML image element with alt attribute value as "website logo" in the Header:::5:::', () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    const imageEl = screen.getByRole('img', {
      name: /website logo/i,
      exact: false,
    })
    expect(imageEl).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_102:::Results Route should consist of an HTML image element with alt attribute value as "website logo" is wrapped with Link from react-router-dom in the Header:::10:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    expect(
      screen.getByRole('link', {
        name: /website logo/,
        exact: false,
      }),
    ).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_103:::Results Route should consist of an HTML button element with text content as "Logout" in the Header:::5:::', () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    expect(
      screen.getByRole('button', {
        name: /Logout/i,
        exact: false,
      }),
    ).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_104:::When the "Submit Assessment" button in Assessment Route is clicked, then the page should be navigated to Results Route and should consist of an HTML image element with alt attribute value as "submit":::10:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />, {route: assessmentRoutePath})
    const submitBtn = await screen.findByRole('button', {
      name: /Submit Assessment/i,
      exact: false,
    })
    userEvent.click(submitBtn)
    expect(window.location.pathname).toBe(resultsRoutePath)
    const imageEl = screen.getByRole('img', {
      name: /submit/i,
      exact: false,
    })
    expect(imageEl).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_105:::When the "Submit Assessment" button in Assessment Route is clicked, then the page should be navigated to Results Route and should consist of an HTML main heading element with text content as "Congrats! You completed the assessment":::10:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />, {route: assessmentRoutePath})
    const submitBtn = await screen.findByRole('button', {
      name: /Submit Assessment/i,
      exact: false,
    })
    userEvent.click(submitBtn)
    expect(window.location.pathname).toBe(resultsRoutePath)
    const headingEl = screen.getByRole('heading', {
      name: /Congrats! You completed the assessment/i,
      exact: false,
    })
    expect(headingEl).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_106:::When the "Submit Assessment" button in Assessment Route is clicked, then the page should be navigated to Results Route and should consist of an HTML paragraph element with text content as "Time Taken":::10:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />, {route: assessmentRoutePath})
    const submitBtn = await screen.findByRole('button', {
      name: /Submit Assessment/i,
      exact: false,
    })
    userEvent.click(submitBtn)
    expect(window.location.pathname).toBe(resultsRoutePath)
    const paragraphEl = screen.getByText(/Time Taken/i, {
      exact: false,
    })
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_107:::When the "Submit Assessment" button in Assessment Route is clicked, then the page should be navigated to Results Route and should consist of an HTML paragraph element with text content as the time taken to submit the assessment in the format of "HH:MM:SS":::15:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />, {route: assessmentRoutePath})
    const submitBtn = await screen.findByRole('button', {
      name: /Submit Assessment/i,
      exact: false,
    })
    jest.runTimersToTime(60000)
    userEvent.click(submitBtn)
    expect(window.location.pathname).toBe(resultsRoutePath)
    const paragraphEl = screen.getByText(/00:01:00/i, {
      exact: false,
    })
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_108:::When the "Submit Assessment" button in Assessment Route is clicked, then the page should be navigated to Results Route and should consist of an HTML paragraph element with text content as "Your score":::10:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />, {route: assessmentRoutePath})
    const submitBtn = await screen.findByRole('button', {
      name: /Submit Assessment/i,
      exact: false,
    })
    userEvent.click(submitBtn)
    expect(window.location.pathname).toBe(resultsRoutePath)
    const paragraphEl = screen.getByText(/Your score/i, {
      exact: false,
    })
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_109:::When the "Submit Assessment" button in Assessment Route is clicked, then the page should be navigated to Results Route and should consist of an HTML paragraph element with text content as the score achieved in the assessment:::15:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />, {route: assessmentRoutePath})
    const submitBtn = await screen.findByRole('button', {
      name: /Submit Assessment/i,
      exact: false,
    })
    const optionBtn = screen.getByRole('button', {
      name: questionsResponse.questions[0].options[0].text,
      exact: false,
    })
    userEvent.click(optionBtn)
    userEvent.click(submitBtn)
    expect(window.location.pathname).toBe(resultsRoutePath)
    const paragraphEl = screen.getByText(/^1$/i, {
      exact: false,
    })
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_110:::When the "Submit Assessment" button in Assessment Route is clicked, then the page should be navigated to Results Route and should consist of an HTML button element with text content as "Reattempt":::10:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />, {route: assessmentRoutePath})
    const submitBtn = await screen.findByRole('button', {
      name: /Submit Assessment/i,
      exact: false,
    })
    userEvent.click(submitBtn)
    expect(window.location.pathname).toBe(resultsRoutePath)
    const buttonEl = screen.getByRole('button', {
      name: /Reattempt/i,
      exact: false,
    })
    expect(buttonEl).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_111:::When the "Submit Assessment" button in Assessment Route is clicked, then the page should be navigated to Results Route and the "Reattempt" button is clicked, then the page should be navigated to Assessment Route and should consist of an HTML button element with text content as "Submit Assessment":::10:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />, {route: assessmentRoutePath})
    const submitBtn = await screen.findByRole('button', {
      name: /Submit Assessment/i,
      exact: false,
    })
    userEvent.click(submitBtn)
    expect(window.location.pathname).toBe(resultsRoutePath)
    const reattemptBtnEl = screen.getByRole('button', {
      name: /Reattempt/i,
      exact: false,
    })
    userEvent.click(reattemptBtnEl)
    const submitBtn1 = await screen.findByRole('button', {
      name: /Submit Assessment/i,
      exact: false,
    })
    expect(submitBtn1).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_112:::When the "Submit Assessment" button is clicked in the reattempted assessment, then the page should be navigated to Results Route and should consist of an HTML paragraph element to display the time taken to submit the reattempted assessment in the format of "HH:MM:SS":::15:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />, {route: assessmentRoutePath})
    const submitBtn = await screen.findByRole('button', {
      name: /Submit Assessment/i,
      exact: false,
    })
    jest.runTimersToTime(60000)
    userEvent.click(submitBtn)
    expect(window.location.pathname).toBe(resultsRoutePath)
    const reattemptBtnEl = screen.getByRole('button', {
      name: /Reattempt/i,
      exact: false,
    })
    userEvent.click(reattemptBtnEl)
    const submitBtnEl1 = await screen.findByRole('button', {
      name: /Submit Assessment/i,
      exact: false,
    })
    jest.runTimersToTime(6000)
    userEvent.click(submitBtnEl1)
    const paragraphEl = screen.getByText(/00:00:06/i, {
      exact: false,
    })
    expect(paragraphEl).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_113:::When the "Submit Assessment" button is clicked in the reattempted assessment, then the page should be navigated to Results Route and should consist of an HTML paragraph element to display the score achieved in the reattempted assessment:::15:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />, {route: assessmentRoutePath})
    const submitBtn = await screen.findByRole('button', {
      name: /Submit Assessment/i,
      exact: false,
    })
    const optionBtn = screen.getByRole('button', {
      name: questionsResponse.questions[0].options[0].text,
      exact: false,
    })
    userEvent.click(optionBtn)
    userEvent.click(submitBtn)
    expect(window.location.pathname).toBe(resultsRoutePath)
    const reattemptBtnEl = screen.getByRole('button', {
      name: /Reattempt/i,
      exact: false,
    })
    userEvent.click(reattemptBtnEl)
    const submitBtnEl1 = await screen.findByRole('button', {
      name: /Submit Assessment/i,
      exact: false,
    })
    const optionBtn1 = screen.getByRole('button', {
      name: questionsResponse.questions[0].options[0].text,
      exact: false,
    })
    userEvent.click(optionBtn1)
    const questionNumBtn = await screen.findByRole('button', {
      name: /^2$/i,
      exact: false,
    })
    userEvent.click(questionNumBtn)
    const optionBtn2 = screen.getByRole('img', {
      name: questionsResponse.questions[1].options[2].text,
      exact: false,
    })
    userEvent.click(optionBtn2)
    userEvent.click(submitBtnEl1)
    const paragraphEl = screen.getByText(/^2$/i, {
      exact: false,
    })
    expect(paragraphEl).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_114:::When the website logo in the Header of the Results Route is clicked, then the page should be navigated to Home Route and should consist of an HTML main heading element with text content as "Instructions":::10:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    const imageEl = screen.getByRole('img', {
      name: /website logo/i,
      exact: false,
    })
    userEvent.click(imageEl)
    const headingEl = await screen.findByRole('heading', {
      name: /Instructions/i,
      exact: false,
    })
    expect(headingEl).toBeInTheDocument()
    expect(window.location.pathname).toBe(homeRoutePath)
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_115:::When the "Logout" button in the Header of the Results Route is clicked, then the Cookies.remove() method should be called with the argument as "jwt_token":::15:::', () => {
    mockGetCookie()
    mockRemoveCookie()
    renderWithBrowserRouter(<App />)
    const logoutBtn = screen.getByRole('button', {
      name: /Logout/i,
      exact: false,
    })
    userEvent.click(logoutBtn)
    expect(Cookies.remove).toHaveBeenCalledWith('jwt_token')
    restoreRemoveCookieFns()
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_116:::When the "Logout" button in the Header of the Results Route is clicked, the history.replace() method should be called with the argument as "/login":::15:::', () => {
    mockGetCookie()
    mockRemoveCookie()
    const {history} = rtlRender(<App />, homeRoutePath)
    mockHistoryReplace(history)
    const logoutBtn = screen.getByRole('button', {
      name: /Logout/i,
      exact: false,
    })
    userEvent.click(logoutBtn)
    expect(history.replace).toHaveBeenCalledWith(loginRoutePath)
    restoreRemoveCookieFns()
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_117:::When the "Logout" button in the Header of the Results Route is clicked, then the page should be navigated to Login Route and should consist of an HTML button element with text content as "Login" :::15:::', () => {
    mockGetCookie()
    mockRemoveCookie()
    renderWithBrowserRouter(<App />)
    const logoutBtn = screen.getByRole('button', {
      name: /Logout/i,
      exact: false,
    })
    restoreGetCookieFns()
    mockGetCookie(false)
    userEvent.click(logoutBtn)
    expect(window.location.pathname).toBe(loginRoutePath)
    const buttonEl = screen.getByRole('button', {name: /Login/i, exact: false})
    expect(buttonEl).toBeInTheDocument()
    restoreRemoveCookieFns()
    restoreGetCookieFns()
  })
})
