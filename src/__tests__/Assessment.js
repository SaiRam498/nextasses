import {createMemoryHistory} from 'history'
import Cookies from 'js-cookie'
import {Router, BrowserRouter} from 'react-router-dom'
import {rest} from 'msw'
import {setupServer} from 'msw/node'
import {act} from 'react-dom/test-utils'

import {render, screen, waitForElementToBeRemoved} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import App from '../App'

// #region

const questionsApiUrl = 'https://apis.ccbp.in/assess/questions'
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
const assessmentRoutePath = '/assessment'
const loginRoutePath = '/login'
const homeRoutePath = '/'
const resultsRoutePath = '/results'
const originalConsoleError = console.error
const originalFetch = window.fetch
const renderWithBrowserRouter = (ui, {route = '/assessment'} = {}) => {
  window.history.pushState({}, 'Test page', route)
  return render(ui, {wrapper: BrowserRouter})
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
  rest.get(questionsApiUrl, (req, res, ctx) =>
    res(ctx.json(questionsResponse)),
  ),
]
const server = setupServer(...handlers)

// #endregion

describe(':::RJSCPU2OLA_TEST_SUITE_1:::Assessment Route tests', () => {
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
    console.error = originalConsoleError
    window.fetch = originalFetch
  })

  it(':::RJSCPU2OLA_TEST_1:::Assessment Route must include a minimum of two HTML list items and HTML options. Additionally, the list of question options and the list of question numbers, both received from the response, should be rendered. Each option item in the question options list and each item in the question numbers list must have a unique key as a prop:::15:::', async () => {
    mockGetCookie()
    console.error = message => {
      if (
        /Each child in a list should have a unique "key" prop/.test(message) ||
        /Encountered two children with the same key/.test(message)
      ) {
        throw new Error(message)
      }
    }
    renderWithBrowserRouter(<App />)
    const paragraphEl = await screen.findByText(
      new RegExp(`${questionsResponse.questions[0].question_text}`, 'i'),
      {
        exact: false,
      },
    )
    expect(paragraphEl).toBeInTheDocument()
    const listEls = screen.getAllByRole('listitem')
    expect(listEls.length).toBeGreaterThanOrEqual(2)
    const questionNumTwoBtn = await screen.findByRole('button', {
      name: /^2$/i,
      exact: false,
    })
    userEvent.click(questionNumTwoBtn)
    const questionNumThreeBtn = await screen.findByRole('button', {
      name: /^3$/i,
      exact: false,
    })
    userEvent.click(questionNumThreeBtn)
    expect(screen.getAllByRole('option').length).toBeGreaterThanOrEqual(2)
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_2:::When the Assessment Route is opened, an HTTP GET request should be made to the given questionsApiUrl to get the list of questions:::10:::', async () => {
    mockGetCookie()
    const promise = Promise.resolve(questionsResponse)
    const mockFetchFunction = jest.fn().mockImplementation(() => ({
      ok: true,
      json: () => promise,
    }))
    window.fetch = mockFetchFunction
    renderWithBrowserRouter(<App />)
    expect(mockFetchFunction.mock.calls[0][0]).toBe(questionsApiUrl)
    await act(() => promise)
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_3:::When the HTTP GET request in the Assessment Route is successful, then the page should initially consist of an HTML paragraph element with text content as the value of the key "question_text" of the first question received from the response:::10:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    const paragraphEl = await screen.findByText(
      new RegExp(`${questionsResponse.questions[0].question_text}`, 'i'),
      {
        exact: false,
      },
    )
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_4:::When "/assessment" is provided as the URL by an unauthenticated user, then the page should be navigated to Login Route and should consist of an HTML button element with text content as "Login":::15:::', () => {
    mockGetCookie(false)
    renderWithBrowserRouter(<App />)
    expect(window.location.pathname).toBe(loginRoutePath)
    const buttonEl = screen.getByRole('button', {name: /Login/i, exact: false})
    expect(buttonEl).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_5:::When "/assessment" is provided as the URL by an authenticated user, then the page should be navigated to Assessment Route and should consist of an HTML button element with text content as "Submit Assessment":::15:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    const buttonEl = await screen.findByRole('button', {
      name: /Submit Assessment/i,
      exact: false,
    })
    expect(buttonEl).toBeInTheDocument()
    expect(window.location.pathname).toBe(assessmentRoutePath)
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_6:::Assessment Route should consist of an HTML image element with alt attribute value as "website logo" in the Header:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    expect(
      await screen.findByText(
        new RegExp(`${questionsResponse.questions[0].question_text}`, 'i'),
        {
          exact: false,
        },
      ),
    ).toBeInTheDocument()
    const imageEl = screen.getByRole('img', {
      name: /website logo/i,
      exact: false,
    })
    expect(imageEl).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_7:::Assessment Route should consist of an HTML image element with alt attribute value as "website logo" is wrapped with Link from react-router-dom in the Header:::10:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    expect(
      await screen.findByText(
        new RegExp(`${questionsResponse.questions[0].question_text}`, 'i'),
        {
          exact: false,
        },
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', {
        name: /website logo/,
        exact: false,
      }),
    ).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_8:::Assessment Route should consist of an HTML button element with text content as "Logout" in the Header:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    expect(
      await screen.findByText(
        new RegExp(`${questionsResponse.questions[0].question_text}`, 'i'),
        {
          exact: false,
        },
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: /Logout/i,
        exact: false,
      }),
    ).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_9:::When the Assessment Route is opened, an HTML container element with data-testid attribute value as "loader" should be displayed while the HTTP GET request is in progress:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    await waitForElementToBeRemoved(() => screen.queryByTestId('loader'))
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_10:::When the HTTP GET request in the Assessment Route is successful, then the page should consist of the options based on the value of the key "option_type" in the first question received from the response:::10:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    expect(
      await screen.findByRole('button', {
        name: questionsResponse.questions[0].options[0].text,
        exact: false,
      }),
    ).toBeInTheDocument()
    for (let index = 1; index < 4; index += 1) {
      expect(
        screen.getByRole('button', {
          name: questionsResponse.questions[0].options[index].text,
          exact: false,
        }),
      ).toBeInTheDocument()
    }
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_11:::When the HTTP GET request in the Assessment Route is successful, then the page should consist of an HTML button element with text content as "Next Question":::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    expect(
      await screen.findByRole('button', {
        name: /Next Question/i,
        exact: false,
      }),
    ).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_12:::When the HTTP GET request in the Assessment Route is successful, then the page should consist of an HTML paragraph element with text content as "Time Left":::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    const paragraphEl = await screen.findByText(/Time Left/i, {
      hidden: true,
      exact: false,
    })
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_13:::When the HTTP GET request in the Assessment Route is successful, then the page should initially consist of an HTML paragraph element to display the timer left with text content as "00:10:00":::10:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    const paragraphEl = await screen.findByText(/00:10:00/i, {
      exact: false,
    })
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_14:::When the HTTP GET request in the Assessment Route is successful, then the page should initially consist of an HTML paragraph element to display the count of answered questions with text content as "0":::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    const paragraphEl = await screen.findByText(/^0$/i, {
      exact: false,
    })
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_15:::When the HTTP GET request in the Assessment Route is successful, then the page should consist of an HTML paragraph element with text content as "Answered Questions":::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    const paragraphEl = await screen.findByText(/^Answered Questions$/i, {
      exact: false,
    })
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_16:::When the HTTP GET request in the Assessment Route is successful, then the page should initially consist of an HTML paragraph element to display the count of unanswered questions with text content as the value of the key "total" received from the response:::10:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    const paragraphEl = await screen.findByText(
      new RegExp(`^${questionsResponse.total}$`, 'i'),
      {
        exact: false,
        ignore: 'button',
      },
    )
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_17:::When the HTTP GET request in the Assessment Route is successful, then the page should consist of an HTML paragraph element with text content as "Unanswered Questions":::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    const paragraphEl = await screen.findByText(/^Unanswered Questions$/i, {
      exact: false,
    })
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_18:::When the HTTP GET request in the Assessment Route is successful, then the page should consist of an HTML main heading element with text content as "Questions ({total})" and here the total is the value of the key "total" received in the response:::10:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    const headingEl = await screen.findByRole('heading')
    expect(headingEl.textContent).toMatch(
      new RegExp(`Questions [(]${questionsResponse.total}[)]`, 'i'),
    )
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_19:::When the HTTP GET request in the Assessment Route is successful and the active question "options_type" is "DEFAULT", then the page should consist of at least two HTML unordered list elements to display the list of question numbers and options:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    const UlEls = await screen.findAllByRole('list')
    expect(UlEls.length).toBeGreaterThanOrEqual(2)
    expect(UlEls[0].tagName).toBe('UL')
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_20:::When the HTTP GET request in the Assessment Route is successful and the active question "options_type" is "DEFAULT", then the page should consist of HTML list elements to display the list of question numbers and options:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    const UlEls = await screen.findAllByRole('listitem')
    expect(UlEls.length).toBeGreaterThanOrEqual(
      questionsResponse.questions.length +
        questionsResponse.questions[0].options.length,
    )
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_21:::When the HTTP GET request in the Assessment Route is successful and the active question "options_type" is "IMAGE", then the page should consist of at least two HTML unordered list elements to display the list of question numbers and options:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    const questionNumBtn = await screen.findByRole('button', {
      name: /^2$/i,
      exact: false,
    })
    userEvent.click(questionNumBtn)
    const UlEls = await screen.findAllByRole('list')
    expect(UlEls.length).toBeGreaterThanOrEqual(2)
    expect(UlEls[0].tagName).toBe('UL')
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_22:::When the HTTP GET request in the Assessment Route is successful and the active question "options_type" is "IMAGE", then the page should consist of HTML list elements to display the list of question numbers and options:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    const UlEls = await screen.findAllByRole('listitem')
    expect(UlEls.length).toBeGreaterThanOrEqual(
      questionsResponse.questions.length +
        questionsResponse.questions[1].options.length,
    )
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_23:::When the HTTP GET request in the Assessment Route is successful and the active question "options_type" is "SINGLE_SELECT", then the page should consist of at least one HTML unordered list element to display the list of question numbers:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    const questionNumBtn = await screen.findByRole('button', {
      name: /^3$/i,
      exact: false,
    })
    userEvent.click(questionNumBtn)
    const UlEls = await screen.findAllByRole('list')
    expect(UlEls.length).toBeGreaterThanOrEqual(1)
    expect(UlEls[0].tagName).toBe('UL')
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_24:::When the HTTP GET request in the Assessment Route is successful and the active question "options_type" is "SINGLE_SELECT", then the page should consist of HTML list elements to display the list of question numbers:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    const UlEls = await screen.findAllByRole('listitem')
    expect(UlEls.length).toBeGreaterThanOrEqual(
      questionsResponse.questions.length,
    )
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_25:::When the HTTP GET request in the Assessment Route is successful, then the page should consist of HTML button elements to display the list of question numbers with text content as the corresponding question number:::15:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    expect(
      await screen.findByRole('button', {
        name: /^1$/i,
        exact: false,
      }),
    ).toBeInTheDocument()
    for (let index = 1; index < questionsResponse.total; index += 1) {
      expect(
        screen.getByRole('button', {
          name: new RegExp(`^${index}$`, 'i'),
          exact: false,
        }),
      ).toBeInTheDocument()
    }
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_26:::When the HTTP GET request in the Assessment Route is successful, then the page should consist of an HTML button element with text content as "Submit Assessment":::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    expect(
      await screen.findByRole('button', {
        name: /Submit Assessment/i,
        exact: false,
      }),
    ).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_27:::When the HTTP GET request in the Assessment Route is successful, then the timer should start running backwards and should consist of an HTML paragraph element with text content displaying the remaining time in the format of "HH:MM:SS":::10:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    jest.runTimersToTime(1000)
    const paragraphEl = await screen.findByText(/00:09:59/i, {
      hidden: true,
      exact: false,
    })
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_28:::When a question number in the question numbers list of the Assessment Route is clicked, then the page should consist of an HTML paragraph element with text content as the value of the key "question_text" of the corresponding question received from the response:::15:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    const questionNumBtn = await screen.findByRole('button', {
      name: /^1$/i,
      exact: false,
    })
    userEvent.click(questionNumBtn)
    const paragraphEl = screen.getByText(
      new RegExp(`${questionsResponse.questions[0].question_text}`, 'i'),
      {
        exact: false,
      },
    )
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_29:::When a question number with "options_type" as "DEFAULT" in the Assessment Route is clicked, then the page should consist of HTML button elements with text content as the values of the keys "text" in each option of the corresponding question received from the response:::10:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    const questionNumBtn = await screen.findByRole('button', {
      name: /^1$/i,
      exact: false,
    })
    userEvent.click(questionNumBtn)
    for (let index = 0; index < 4; index += 1) {
      expect(
        screen.getByRole('button', {
          name: questionsResponse.questions[0].options[index].text,
          exact: false,
        }),
      ).toBeInTheDocument()
    }
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_30:::When a question number with "options_type" as "IMAGE" in the Assessment Route is clicked, then the page should consist of HTML image elements with alt and src values as the values of the keys "text" and "image_url" respectively in each option of the corresponding question received from the response:::10:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    const questionNumBtn = await screen.findByRole('button', {
      name: /^2$/i,
      exact: false,
    })
    userEvent.click(questionNumBtn)
    for (let index = 0; index < 4; index += 1) {
      const imageEl = screen.getByRole('img', {
        name: questionsResponse.questions[1].options[index].text,
        exact: false,
      })
      expect(imageEl).toBeInTheDocument()
      expect(imageEl.src).toBe(
        questionsResponse.questions[1].options[index].image_url,
      )
    }
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_31:::When a question number with "options_type" as "SINGLE_SELECT" in the Assessment Route is clicked, then the page should consist of an HTML paragraph element with text content as "First option is selected by default":::10:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    const questionNumBtn = await screen.findByRole('button', {
      name: /^3$/i,
      exact: false,
    })
    userEvent.click(questionNumBtn)
    const paragraphEl = screen.getByText(
      /First option is selected by default/i,
      {
        exact: false,
        ignore: 'button',
      },
    )
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_32:::When a question number with "options_type" as "SINGLE_SELECT" in the Assessment Route is clicked, then the page should initially consist of an HTML select element value attribute equal to the value of the key "id" in the first option of the corresponding question received from the response:::15:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    const questionNumBtn = await screen.findByRole('button', {
      name: /^3$/i,
      exact: false,
    })
    userEvent.click(questionNumBtn)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByRole('combobox').value).toBe(
      questionsResponse.questions[2].options[0].id,
    )
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_33:::When a question number with "options_type" as "SINGLE_SELECT" in the Assessment Route is clicked, then the page should consist of HTML option elements with text content as the value of the key "text" in each option of the corresponding question received from the response:::10:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    const questionNumBtn = await screen.findByRole('button', {
      name: /^3$/i,
      exact: false,
    })
    userEvent.click(questionNumBtn)
    for (let index = 0; index < 5; index += 1) {
      expect(
        screen.getByRole('option', {
          name: questionsResponse.questions[2].options[index].text,
          exact: false,
        }),
      ).toBeInTheDocument()
    }
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_34:::When a question number with "options_type" as "SINGLE_SELECT" in the Assessment Route is clicked, then the page should consist of HTML option elements with value attribute equal to key "id" in each option of the corresponding question received from the response:::10:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    const questionNumBtn = await screen.findByRole('button', {
      name: /^3$/i,
      exact: false,
    })
    userEvent.click(questionNumBtn)
    for (let index = 0; index < 5; index += 1) {
      const optionEl = screen.getByRole('option', {
        name: questionsResponse.questions[2].options[index].text,
        exact: false,
      })
      expect(optionEl.value).toBe(
        questionsResponse.questions[2].options[index].id,
      )
    }
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_35:::When a question number with "options_type" as "SINGLE_SELECT" in the Assessment Route is clicked, then the page should initially the first option is selected of the corresponding question received from the response, then the answered questions count should be incremented by one:::15:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    const questionNumBtn = await screen.findByRole('button', {
      name: /^3$/i,
      exact: false,
    })
    userEvent.click(questionNumBtn)
    const paragraphEl = screen.getByText(/^1$/, {
      exact: false,
      ignore: 'button',
    })
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_36:::When a question number with "options_type" as "SINGLE_SELECT" in the Assessment Route is clicked, then the page should initially the first option is selected of the corresponding question received from the response, then the unanswered questions count should be decremented by one:::15:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    const questionNumBtn = await screen.findByRole('button', {
      name: /^3$/i,
      exact: false,
    })
    userEvent.click(questionNumBtn)
    const paragraphEl = screen.getByText(
      new RegExp(`^${questionsResponse.total - 1}$`, 'i'),
      {
        exact: false,
        ignore: 'button',
      },
    )
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_37:::When the "option_type" of the active question is "DEFAULT" and an option in the Assessment Route is clicked, then the answered questions count should be incremented by one:::10:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    const optionBtn = await screen.findByRole('button', {
      name: questionsResponse.questions[0].options[0].text,
      exact: false,
    })
    userEvent.click(optionBtn)
    const paragraphEl = screen.getByText(/^1$/, {
      exact: false,
      ignore: 'button',
    })
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_38:::When the "option_type" of the active question is "DEFAULT" and an option in the Assessment Route is clicked, then the unanswered questions count should be decremented by one:::10:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    const optionBtn = await screen.findByRole('button', {
      name: questionsResponse.questions[0].options[0].text,
      exact: false,
    })
    userEvent.click(optionBtn)
    const paragraphEl = screen.getByText(
      new RegExp(`^${questionsResponse.total - 1}$`, 'i'),
      {
        exact: false,
        ignore: 'button',
      },
    )
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_39:::When the "option_type" of the active question is "IMAGE" and an option in the Assessment Route is clicked, then the answered questions count should be incremented by one:::10:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    const questionNumBtn = await screen.findByRole('button', {
      name: /^2$/i,
      exact: false,
    })
    userEvent.click(questionNumBtn)
    const optionBtn = await screen.findByRole('button', {
      name: questionsResponse.questions[1].options[0].text,
      exact: false,
    })
    userEvent.click(optionBtn)
    const paragraphEl = screen.getByText(/^1$/, {
      exact: false,
      ignore: 'button',
    })
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_40:::When the "option_type" of the active question is "IMAGE" and an option in the Assessment Route is clicked, then the unanswered questions count should be decremented by one:::10:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    const questionNumBtn = await screen.findByRole('button', {
      name: /^2$/i,
      exact: false,
    })
    userEvent.click(questionNumBtn)
    const optionBtn = await screen.findByRole('button', {
      name: questionsResponse.questions[1].options[0].text,
      exact: false,
    })
    userEvent.click(optionBtn)
    const paragraphEl = screen.getByText(
      new RegExp(`^${questionsResponse.total - 1}$`, 'i'),
      {
        exact: false,
        ignore: 'button',
      },
    )
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_41:::When an answered question is opened in the Assessment Route, then the selected option should be displayed:::15:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    const questionNumBtn = await screen.findByRole('button', {
      name: /^3$/i,
      exact: false,
    })
    userEvent.click(questionNumBtn)
    userEvent.selectOptions(
      screen.getByRole('combobox'),
      questionsResponse.questions[2].options[2].text,
    )
    const nxtQuestionNumBtn = screen.getByRole('button', {
      name: /^1$/i,
      exact: false,
    })
    userEvent.click(nxtQuestionNumBtn)
    userEvent.click(questionNumBtn)
    expect(screen.getByRole('combobox').value).toBe(
      questionsResponse.questions[2].options[2].id,
    )
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_42:::When an answered question is opened in the Assessment Route, then the user should be able to change the selected option:::15:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    const questionNumBtn = await screen.findByRole('button', {
      name: /^3$/i,
      exact: false,
    })
    userEvent.click(questionNumBtn)
    userEvent.selectOptions(
      screen.getByRole('combobox'),
      questionsResponse.questions[2].options[2].text,
    )
    expect(screen.getByRole('combobox').value).toBe(
      questionsResponse.questions[2].options[2].id,
    )
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_43:::When an answered question is opened in the Assessment Route, if the selected option is changed, then the answered questions count should remain the same:::15:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    const questionNumBtn = await screen.findByRole('button', {
      name: /^3$/i,
      exact: false,
    })
    userEvent.click(questionNumBtn)
    userEvent.selectOptions(
      screen.getByRole('combobox'),
      questionsResponse.questions[2].options[2].text,
    )
    expect(screen.getByRole('combobox').value).toBe(
      questionsResponse.questions[2].options[2].id,
    )
    const paragraphEl = screen.getByText(/^1$/, {
      exact: false,
      ignore: 'button',
    })
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_44:::When an answered question is opened in the Assessment Route, if the selected option is changed, then the unanswered questions count should remain the same:::15:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    const questionNumBtn = await screen.findByRole('button', {
      name: /^3$/i,
      exact: false,
    })
    userEvent.click(questionNumBtn)
    userEvent.selectOptions(
      screen.getByRole('combobox'),
      questionsResponse.questions[2].options[2].text,
    )
    expect(screen.getByRole('combobox').value).toBe(
      questionsResponse.questions[2].options[2].id,
    )
    const paragraphEl = screen.getByText(
      new RegExp(`^${questionsResponse.total - 1}$`, 'i'),
      {
        exact: false,
        ignore: 'button',
      },
    )
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_45:::When the "Next Question" button in the Assessment Route is clicked, then the page should consist of an HTML paragraph element with text content as the value of the key "question_text" of the next question received from the response:::15:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    const nxtBtn = await screen.findByRole('button', {
      name: /Next Question/i,
      exact: false,
    })
    userEvent.click(nxtBtn)
    const paragraphEl = screen.getByText(
      new RegExp(`${questionsResponse.questions[1].question_text}`, 'i'),
      {
        exact: false,
      },
    )
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_46:::When the "Next Question" button in the Assessment Route is clicked, then the page should consist of the next question options received from the response:::10:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    const nxtBtn = await screen.findByRole('button', {
      name: /Next Question/i,
      exact: false,
    })
    userEvent.click(nxtBtn)
    for (let index = 0; index < 4; index += 1) {
      const imageEl = screen.getByRole('img', {
        name: questionsResponse.questions[1].options[index].text,
        exact: false,
      })
      expect(imageEl).toBeInTheDocument()
      expect(imageEl.src).toBe(
        questionsResponse.questions[1].options[index].image_url,
      )
    }
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_47:::When the last question number in the question numbers list of the Assessment Route is clicked, then the page should not consist of the "Next Question" button:::10:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    const questionNumBtn = await screen.findByRole('button', {
      name: /^3$/i,
      exact: false,
    })
    userEvent.click(questionNumBtn)
    const nxtBtn = screen.queryByRole('button', {
      name: /Next Question/i,
      exact: false,
    })
    expect(nxtBtn).not.toBeInTheDocument()
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_48:::When the "Submit Assessment" button in the Assessment Route is clicked, then the page should be navigated to Result Route and should consist of an HTML image element with alt attribute value as "submit":::10:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
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

  it(':::RJSCPU2OLA_TEST_49:::When the timer ends in the Assessment Route, then the page should be navigated to Result Route and should consist of an HTML image element with alt attribute value as "time up":::15:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    expect(
      await screen.findByText(
        new RegExp(`${questionsResponse.questions[0].question_text}`, 'i'),
        {
          exact: false,
        },
      ),
    ).toBeInTheDocument()
    jest.runTimersToTime(6000000)
    expect(window.location.pathname).toBe(resultsRoutePath)
    const imageEl = screen.getByRole('img', {
      name: /time up/i,
      exact: false,
    })
    expect(imageEl).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_50:::When the HTTP GET request in Assessment Route is unsuccessful, then the page should consist of an HTML image element with alt attribute value as "failure view":::5:::', async () => {
    mockGetCookie()
    server.use(
      rest.get(questionsApiUrl, (req, res, ctx) =>
        res(ctx.status(400), ctx.json({message: 'Something went wrong'})),
      ),
    )
    renderWithBrowserRouter(<App />)
    const imgEl = await screen.findByRole('img', {
      name: /failure view/i,
      exact: false,
    })
    expect(imgEl).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_51:::When the HTTP GET request in Assessment Route is unsuccessful, the page should consist of an HTML main heading element with text content as "Oops! Something Went Wrong":::5:::', async () => {
    mockGetCookie()
    server.use(
      rest.get(questionsApiUrl, (req, res, ctx) =>
        res(ctx.status(400), ctx.json({message: 'Something went wrong'})),
      ),
    )
    renderWithBrowserRouter(<App />)
    const imgEl = await screen.findByRole('heading', {
      name: /Oops! Something Went Wrong/i,
      exact: false,
    })
    expect(imgEl).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_52:::When the HTTP GET request in Assessment Route is unsuccessful, the page should consist of an HTML paragraph element starting with text content as "We are having some trouble":::5:::', async () => {
    mockGetCookie()
    server.use(
      rest.get(questionsApiUrl, (req, res, ctx) =>
        res(ctx.status(400), ctx.json({message: 'Something went wrong'})),
      ),
    )
    renderWithBrowserRouter(<App />)

    const paragraphEl = await screen.findByText(/We are having some trouble/i, {
      exact: false,
    })
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_53:::When the HTTP GET request in Assessment Route is unsuccessful, the page should consist of an HTML button element with text content as "Retry":::5:::', async () => {
    mockGetCookie()
    server.use(
      rest.get(questionsApiUrl, (req, res, ctx) =>
        res(ctx.status(400), ctx.json({message: 'Something went wrong'})),
      ),
    )

    renderWithBrowserRouter(<App />)
    const buttonEl = await screen.findByRole('button', {
      name: /Retry/i,
      exact: false,
    })

    expect(buttonEl).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_54:::When the HTTP GET request in Assessment Route is unsuccessful and the "Retry" button is clicked, then an HTTP GET request should be made to questionsApiUrl:::10:::', async () => {
    mockGetCookie()
    const mockFetchFunction = jest.fn().mockImplementation(() => ({
      ok: false,
      json: () => Promise.resolve({}),
    }))
    window.fetch = mockFetchFunction
    renderWithBrowserRouter(<App />)
    const buttonEl = await screen.findByRole('button', {
      name: /Retry/i,
      exact: false,
    })
    expect(buttonEl).toBeInTheDocument()
    userEvent.click(buttonEl)
    expect(mockFetchFunction.mock.calls[1][0]).toBe(`${questionsApiUrl}`)
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_55:::When the website logo in the Header of the Assessment Route is clicked, then the page should be navigated to Home Route and should consist of an HTML main heading element with text content as "Instructions":::10:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    expect(
      await screen.findByText(
        new RegExp(`${questionsResponse.questions[0].question_text}`, 'i'),
        {
          exact: false,
        },
      ),
    ).toBeInTheDocument()
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

  it(':::RJSCPU2OLA_TEST_56:::When the "Logout" button in the Header of the Assessment Route is clicked, then the Cookies.remove() method should be called with the argument as "jwt_token":::15:::', () => {
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

  it(':::RJSCPU2OLA_TEST_57:::When the "Logout" button in the Header of the Assessment Route is clicked, the history.replace() method should be called with the argument as "/login":::15:::', () => {
    mockGetCookie()
    mockRemoveCookie()
    const {history} = rtlRender(<App />, assessmentRoutePath)
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

  it(':::RJSCPU2OLA_TEST_58:::When the "Logout" button in the Header of the Assessment Route is clicked, then the page should be navigated to Login Route and should consist of an HTML button element with text content as "Login":::15:::', () => {
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
