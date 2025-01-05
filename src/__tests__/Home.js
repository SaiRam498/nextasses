import {createMemoryHistory} from 'history'
import {Router, BrowserRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {rest} from 'msw'
import {setupServer} from 'msw/node'

import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import App from '../App'

// #region

const questionsResponse = {
  questions: [
    {
      id: 'questionB',
      question_text: 'What is the syntax to log a string in the console?',
      options_type: 'DEFAULT',
      options: [
        {
          id: '4',
          text: 'console.log()',
          is_correct: 'true',
        },
        {
          id: '5',
          text: 'log.console()',
          is_correct: 'false',
        },
        {
          id: '6',
          text: 'console()',
          is_correct: 'false',
        },
        {
          id: '37',
          text: 'log()',
          is_correct: 'false',
        },
      ],
    },
    {
      id: 'questionA',
      question_text: 'In which of the below code will Hello World! logs',
      options_type: 'IMAGE',
      options: [
        {
          id: '1',
          text: 'one',
          image_url:
            'https://res.cloudinary.com/dwlftsdge/image/upload/v1632737752/APIS/1_i4aoo7.png',
          is_correct: 'true',
        },
        {
          id: '2',
          text: 'two',
          image_url:
            'https://res.cloudinary.com/dwlftsdge/image/upload/v1632737752/APIS/2_pgyc02.png',
          is_correct: 'false',
        },
        {
          id: '3',
          text: 'three',
          image_url:
            'https://res.cloudinary.com/dwlftsdge/image/upload/v1632742232/APIS/3_iry4mh.png',
          is_correct: 'false',
        },
        {
          id: '40',
          text: 'four',
          image_url:
            'https://res.cloudinary.com/dwlftsdge/image/upload/v1632742232/APIS/3_iry4mh.png',
          is_correct: 'false',
        },
      ],
    },
    {
      id: 'questionC',
      question_text: 'What is the syntax to log a string in the console?',
      options_type: 'SINGLE_SELECT',
      options: [
        {
          id: '7',
          text: 'console.log()',
          is_correct: 'true',
        },
        {
          id: '8',
          text: 'log.console()',
          is_correct: 'false',
        },
        {
          id: '9',
          text: 'console()',
          is_correct: 'false',
        },
        {
          id: '31',
          text: 'log()',
          is_correct: 'false',
        },
        {
          id: '32',
          text: 'logger()',
          is_correct: 'false',
        },
      ],
    },
  ],
  total: 3,
}
const questionsUrl = 'https://apis.ccbp.in/assess/questions'
const assessmentRoutePath = '/assessment'
const loginRoutePath = '/login'
const homeRoutePath = '/'
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
const renderWithBrowserRouter = (ui, {route = homeRoutePath} = {}) => {
  window.history.pushState({}, 'Test page', route)
  return render(ui, {wrapper: BrowserRouter})
}

// #endregion

describe(':::RJSCPU2OLA_TEST_SUITE_2:::Home Route tests', () => {
  beforeAll(() => {
    server.listen()
  })

  afterAll(() => {
    server.close()
  })

  afterEach(() => {
    server.resetHandlers()
  })

  it(':::RJSCPU2OLA_TEST_59:::When "/" is provided as the URL by an unauthenticated user, then the page should be navigated to Login Route and should consist of an HTML button element with text content as "Login":::15:::', () => {
    mockGetCookie(false)
    renderWithBrowserRouter(<App />)
    expect(window.location.pathname).toBe(loginRoutePath)
    const buttonEl = screen.getByRole('button', {name: /Login/i, exact: false})
    expect(buttonEl).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_60:::When "/" is provided as the URL by an authenticated user, then the page should be navigated to Home Route and should consist of an HTML main heading element with text content as "Instructions":::15:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    expect(window.location.pathname).toBe(homeRoutePath)
    expect(
      screen.getByRole('heading', {
        name: /Instructions/i,
        exact: false,
      }),
    ).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_61:::Home Route should consist of an HTML image element with alt attribute value as "website logo" in the Header:::5:::', () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    const imageEl = screen.getByRole('img', {
      name: /website logo/i,
      exact: false,
    })
    expect(imageEl).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_62:::Home Route should consist of an HTML image element with alt attribute value as "website logo" is wrapped with Link from react-router-dom in the Header:::10:::', async () => {
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

  it(':::RJSCPU2OLA_TEST_63:::Home Route should consist of an HTML button element with text content as "Logout" in the Header:::5:::', async () => {
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

  it(':::RJSCPU2OLA_TEST_64:::Home Route should consist of an HTML image element with alt attribute value as "assessment":::5:::', () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    const imageEl = screen.getByRole('img', {
      name: /assessment/i,
      exact: false,
    })
    expect(imageEl).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_65:::Home Route should consist of an HTML main heading element with text content as "Instructions":::5:::', () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    expect(
      screen.getByRole('heading', {
        name: /Instructions/i,
        exact: false,
      }),
    ).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_66:::Home Route should consist of an HTML ordered list element to display the list of instructions:::5:::', () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    expect(screen.getByRole('list')).toBeInTheDocument()
    expect(screen.getByRole('list').tagName).toBe('OL')
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_67:::Home Route should consist of at least five HTML list items to display the list of instructions:::5:::', () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    expect(screen.getAllByRole('listitem').length).toBeGreaterThanOrEqual(5)
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_68:::Home Route should consist of an HTML list item element with text content as "Total Questions: 10":::5:::', () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    const listEls = screen.getAllByRole('listitem')
    expect(
      listEls.some(eachListItem =>
        eachListItem.textContent.match(/Total Questions: 10/i),
      ),
    ).toBeTruthy()
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_69:::Home Route should consist of an HTML list item element with text content as "Types of Questions: MCQs":::5:::', () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    const listEls = screen.getAllByRole('listitem')
    expect(
      listEls.some(eachListItem =>
        eachListItem.textContent.match(/Types of Questions: MCQs/i),
      ),
    ).toBeTruthy()
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_70:::Home Route should consist of an HTML list item element with text content as "Duration: 10 Mins":::5:::', () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    const listEls = screen.getAllByRole('listitem')
    expect(
      listEls.some(eachListItem =>
        eachListItem.textContent.match(/Duration: 10 Mins/i),
      ),
    ).toBeTruthy()
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_71:::Home Route should consist of an HTML list item element with text content as "Marking Scheme: Every Correct response, get 1 mark":::5:::', () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    const listEls = screen.getAllByRole('listitem')
    expect(
      listEls.some(eachListItem =>
        eachListItem.textContent.match(
          /Marking Scheme: Every Correct response, get 1 mark/i,
        ),
      ),
    ).toBeTruthy()
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_72:::Home Route should consist of an HTML list item element with text content as "All the progress will be lost, if you reload during the assessment":::5:::', () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    const listEls = screen.getAllByRole('listitem')
    expect(
      listEls.some(eachListItem =>
        eachListItem.textContent.match(
          /All the progress will be lost, if you reload during the assessment/i,
        ),
      ),
    ).toBeTruthy()
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_73:::Home Route should consist of an HTML button element with text content as "Start Assessment":::5:::', () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    expect(
      screen.getByRole('button', {name: /Start Assessment/i, exact: false}),
    ).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_74:::Home Route should consist of an HTML button element with text content as "Start Assessment" is wrapped with Link from react-router-dom:::5:::', () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    expect(
      screen.getByRole('link', {
        name: /Start Assessment/,
        exact: false,
      }),
    ).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_75:::When the "Start Assessment" button of the Home Route is clicked, then the page should be navigated to Assessment Route and should consist of an HTML button element with text content as "Submit Assessment":::10:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    const startBtn = screen.getByRole('button', {
      name: /Start Assessment/i,
      exact: false,
    })
    userEvent.click(startBtn)
    expect(window.location.pathname).toBe(assessmentRoutePath)
    const submitBtn = await screen.findByRole('button', {
      name: /Submit Assessment/i,
      exact: false,
    })
    expect(submitBtn).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_76:::When the "Logout" button in the Header of the Home Route is clicked, then the Cookies.remove() method should be called with the argument as "jwt_token":::15:::', () => {
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

  it(':::RJSCPU2OLA_TEST_77:::When the "Logout" button in the Header of the Home Route is clicked, the history.replace() method should be called with the argument as "/login":::15:::', () => {
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

  it(':::RJSCPU2OLA_TEST_78:::When the "Logout" button in the Header of the Home Route is clicked, then the page should be navigated to Login Route and should consist of an HTML button element with text content as "Login":::15:::', () => {
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
