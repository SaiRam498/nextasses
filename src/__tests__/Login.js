import {createMemoryHistory} from 'history'
import {BrowserRouter, Router} from 'react-router-dom'
import Cookies from 'js-cookie'
import {act} from 'react-dom/test-utils'

import {render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {setupServer} from 'msw/node'
import {rest} from 'msw'

import App from '../App'

// #region

const loginRoutePath = '/login'
const homeRoutePath = '/'

const loginSuccessResponse = {
  jwt_token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJhaHVsIiwicm9sZSI6IlBSSU1FX1VTRVIiLCJpYXQiOjE2MTk2Mjg2MTN9.nZDlFsnSWArLKKeF0QbmdVfLgzUbx1BGJsqa2kc_21Y',
}

const invalidUser = {
  error_msg: 'Username is not found',
}

const loginApiUrl = 'https://apis.ccbp.in/login'

const handlers = [
  rest.post(loginApiUrl, (req, res, ctx) => {
    const {username, password} = JSON.parse(req.body)

    if (username === 'rahul' && password === 'rahul@2021') {
      return res(ctx.json(loginSuccessResponse))
    }
    return res(ctx.status(400, 'invalid request'), ctx.json(invalidUser))
  }),
]

const server = setupServer(...handlers)

let historyInstance
const mockHistoryReplace = instance => {
  jest.spyOn(instance, 'replace')
}

const restoreHistoryReplace = instance => {
  instance.replace.mockRestore()
}

const mockSetCookie = () => {
  jest.spyOn(Cookies, 'set')
  Cookies.set = jest.fn()
}

const restoreSetCookieFns = () => {
  Cookies.set.mockRestore()
}

const mockGetCookie = () => {
  const mockedGetCookie = jest.fn(() => ({
    jwt_token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJhaHVsIiwiaWF0IjoxNjE5MDk0MjQxfQ.1i6BbQkQvtvpv72lHPNbl2JOZIB03uRcPbchYYCkL9o',
  }))
  jest.spyOn(Cookies, 'get')
  Cookies.get = mockedGetCookie
}

const restoreGetCookieFns = () => {
  Cookies.get.mockRestore()
}

const rtlRender = (ui = <App />, path = '/login') => {
  historyInstance = createMemoryHistory()
  historyInstance.push(path)
  const {container} = render(<Router history={historyInstance}>{ui}</Router>)
  return {
    history: historyInstance,
    container,
  }
}

const renderWithBrowserRouter = (ui, {route = '/login'} = {}) => {
  window.history.pushState({}, 'Test page', route)
  return render(ui, {wrapper: BrowserRouter})
}

const originalFetch = window.fetch
// #endregion

describe(':::RJSCPU2OLA_TEST_SUITE_3:::Nxt Assess Authentication Tests', () => {
  beforeAll(() => {
    server.listen()
  })

  afterEach(() => {
    server.resetHandlers()
    window.fetch = originalFetch
  })

  afterAll(() => {
    server.close()
  })

  it(':::RJSCPU2OLA_TEST_79:::When "/login" is provided as the URL by an unauthenticated user, then the page should be navigated to Login Route and should consist of an HTML button element with text content as "Login":::15:::', async () => {
    renderWithBrowserRouter(<App />)
    const buttonEl = screen.getByRole('button', {name: /Login/i, exact: false})
    expect(buttonEl).toBeInTheDocument()
    expect(window.location.pathname).toBe(loginRoutePath)
  })

  it(':::RJSCPU2OLA_TEST_80:::When "/login" is provided as the URL by an authenticated user, then the page should be navigated to Home Route and should consist of an HTML heading element with text content as "Instructions":::15:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />, loginRoutePath)
    expect(window.location.pathname).toBe(homeRoutePath)
    const headingEl = await screen.findByRole('heading', {
      name: /Instructions/i,
      exact: false,
    })
    expect(headingEl).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_81:::Login Route should consist of an HTML form element:::5:::', () => {
    const {container} = renderWithBrowserRouter(<App />)
    const formEl = container.querySelector('form')
    expect(formEl).toBeInTheDocument()
  })

  it(':::RJSCPU2OLA_TEST_82:::Login Route should consist of an HTML image element with alt attribute value as "login website logo":::5:::', () => {
    renderWithBrowserRouter(<App />)
    const imageEl = screen.getByRole('img', {name: /login website logo/i})
    expect(imageEl).toBeInTheDocument()
  })

  it(':::RJSCPU2OLA_TEST_83:::Login Route should consist of an HTML input element with label text as "USERNAME" and type attribute value as "text":::5:::', () => {
    renderWithBrowserRouter(<App />)
    expect(
      screen.getByLabelText(/USERNAME/i, {
        exact: false,
      }).type,
    ).toBe('text')
  })

  it(':::RJSCPU2OLA_TEST_84:::Login Route should consist of an HTML input element with label text as "PASSWORD" and type attribute value as "password":::5:::', () => {
    renderWithBrowserRouter(<App />)
    expect(screen.getByLabelText(/^PASSWORD/i, {exact: false}).type).toBe(
      'password',
    )
  })

  it(':::RJSCPU2OLA_TEST_85:::Login Route should consist of an HTML input element with label text as "Show Password" and type attribute value as "checkbox":::5:::', () => {
    renderWithBrowserRouter(<App />)
    expect(
      screen.getByLabelText(/Show Password/i, {
        exact: false,
      }).type,
    ).toBe('checkbox')
  })

  it(':::RJSCPU2OLA_TEST_86:::Login Route should consist of an HTML button element with text content as "Login" and type attribute value as "submit":::5:::', () => {
    renderWithBrowserRouter(<App />)
    const buttonEl = screen.getByRole('button', {name: /Login/i, exact: false})
    expect(buttonEl).toBeInTheDocument()
    expect(buttonEl.type).toBe('submit')
  })

  it(':::RJSCPU2OLA_TEST_87:::When a non-empty value is provided in the HTML input element with the label text as "USERNAME", then the value provided should be displayed in the HTML input element:::10:::', () => {
    renderWithBrowserRouter(<App />)
    userEvent.type(
      screen.getByLabelText(/USERNAME/i, {
        exact: false,
      }),
      'rahul',
    )
    expect(
      screen.getByLabelText(/USERNAME/i, {
        exact: false,
      }),
    ).toHaveValue('rahul')
  })

  it(':::RJSCPU2OLA_TEST_88:::When a non-empty value is provided in the HTML input element with the label text as "PASSWORD", then the value provided should be displayed in the HTML input element:::10:::', () => {
    renderWithBrowserRouter(<App />)
    userEvent.type(
      screen.getByLabelText(/^PASSWORD/i, {
        exact: false,
      }),
      'rahul@2021',
    )
    expect(
      screen.getByLabelText(/^PASSWORD/i, {
        exact: false,
      }),
    ).toHaveValue('rahul@2021')
  })

  it(':::RJSCPU2OLA_TEST_89:::When "Show Password" is checked, then the type of the HTML input element with label text as "PASSWORD" should be "text":::10:::', () => {
    renderWithBrowserRouter(<App />)
    const checkBoxEl = screen.getByLabelText(/Show Password/i, {
      exact: false,
    })
    userEvent.click(checkBoxEl)
    expect(checkBoxEl.checked).toBeTruthy()
    expect(
      screen.getByLabelText(/^PASSWORD/i, {
        exact: false,
      }).type,
    ).toBe('text')
  })

  it(':::RJSCPU2OLA_TEST_90:::When the "Show Password" is unchecked after being checked, then then the type of the input element with label text as "PASSWORD" should be "password":::10:::', () => {
    renderWithBrowserRouter(<App />)
    const checkBoxEl = screen.getByLabelText(/Show Password/i, {
      exact: false,
    })
    userEvent.click(checkBoxEl)
    expect(checkBoxEl.checked).toBeTruthy()
    expect(
      screen.getByLabelText(/^PASSWORD/i, {
        exact: false,
      }).type,
    ).toBe('text')
    userEvent.click(checkBoxEl)
    expect(checkBoxEl.checked).toBeFalsy()
    expect(
      screen.getByLabelText(/^PASSWORD/i, {
        exact: false,
      }).type,
    ).toBe('password')
  })

  it(':::RJSCPU2OLA_TEST_91:::When non-empty values are provided for username and password input and the Login button is clicked, an HTTP POST request should be made to loginApiUrl:::10:::', async () => {
    const promise = Promise.resolve(loginSuccessResponse)
    const mockFetchFunction = jest.fn().mockImplementation(() => ({
      ok: true,
      json: () => promise,
    }))
    window.fetch = mockFetchFunction
    renderWithBrowserRouter(<App />)
    const usernameField = screen.getByLabelText(/USERNAME/i, {
      exact: false,
    })
    const passwordField = screen.getByLabelText(/^PASSWORD/i, {
      exact: false,
    })
    userEvent.type(usernameField, 'test')
    userEvent.type(passwordField, 'test@2021')
    const loginButton = screen.getByRole('button', {
      name: /Login/i,
      exact: false,
    })
    userEvent.click(loginButton)
    await act(() => promise)
    expect(mockFetchFunction.mock.calls[0][0]).toMatch(`${loginApiUrl}`)
  })

  it(':::RJSCPU2OLA_TEST_92:::When non-empty values are provided for username and password input and the Login button is clicked, then an HTTP POST request should be made to loginApiUrl with request object containing the keys "username" and "password" with the values provided respectively:::15:::', async () => {
    const promise = Promise.resolve({message: 'invalid credentials'})
    const mockFetchFunction = jest.fn().mockImplementation(() => ({
      ok: true,
      json: () => promise,
    }))
    window.fetch = mockFetchFunction
    renderWithBrowserRouter(<App />)
    const usernameField = screen.getByLabelText(/USERNAME/i, {
      exact: false,
    })
    const passwordField = screen.getByLabelText(/^PASSWORD/i, {
      exact: false,
    })
    const loginButton = screen.getByRole('button', {
      name: /Login/i,
      exact: false,
    })
    userEvent.type(usernameField, 'test')
    userEvent.type(passwordField, 'test@2021')
    userEvent.click(loginButton)
    const {username, password} = JSON.parse(
      mockFetchFunction.mock.calls[0][1].body,
    )
    expect(username).toBe('test')
    expect(password).toBe('test@2021')
    await act(() => promise)
  })

  it(':::RJSCPU2OLA_TEST_93:::When an invalid username and password are provided, then the page should consist of an HTML paragraph element with text content as respective error message and the page should not be navigated:::10:::', async () => {
    const {history} = rtlRender(<App />)

    const usernameField = screen.getByLabelText(/USERNAME/i, {
      exact: false,
    })
    const passwordField = screen.getByLabelText(/^PASSWORD/i, {
      exact: false,
    })
    const loginButton = screen.getByRole('button', {
      name: /Login/i,
      exact: false,
    })
    expect(history.location.pathname).toBe('/login')

    userEvent.type(usernameField, 'unknown')
    userEvent.type(passwordField, 'rahul@2021')
    userEvent.click(loginButton)
    expect(
      await screen.findByText(/Username is not found/i, {
        exact: false,
      }),
    ).toBeInTheDocument()

    expect(history.location.pathname).toBe(loginRoutePath)
  })

  it(':::RJSCPU2OLA_TEST_94:::When a valid username and password are provided and the Login button is clicked, then the Cookies.set() method should be called with three arguments - "jwt_token" string as the first argument, JWT token value as the second argument, and expiry days as the third argument:::15:::', async () => {
    mockSetCookie()
    renderWithBrowserRouter(<App />)

    const usernameField = screen.getByLabelText(/USERNAME/i, {
      exact: false,
    })
    const passwordField = screen.getByLabelText(/^PASSWORD/i, {
      exact: false,
    })
    const loginButton = screen.getByRole('button', {
      name: /Login/i,
      exact: false,
    })
    userEvent.type(usernameField, 'rahul')
    userEvent.type(passwordField, 'rahul@2021')
    userEvent.click(loginButton)
    await waitFor(() =>
      expect(Cookies.set).toHaveBeenCalledWith(
        'jwt_token',
        loginSuccessResponse.jwt_token,
        expect.objectContaining({expires: expect.any(Number)}),
      ),
    )
    restoreSetCookieFns()
  })

  it(':::RJSCPU2OLA_TEST_95:::When a valid username and password are provided and the Login button is clicked, then the history.replace() method should be called with the argument "/":::15:::', async () => {
    const {history} = rtlRender(<App />)
    mockHistoryReplace(history)

    const usernameField = screen.getByLabelText(/USERNAME/i, {
      exact: false,
    })
    const passwordFields = screen.getByLabelText(/^PASSWORD/i, {
      exact: false,
    })
    const loginButton = screen.getByRole('button', {
      name: /Login/i,
      exact: false,
    })
    userEvent.type(usernameField, 'rahul')
    userEvent.type(passwordFields, 'rahul@2021')
    userEvent.click(loginButton)
    await waitFor(() => expect(history.replace).toHaveBeenCalledWith('/'))
    restoreHistoryReplace(history)
  })

  it(':::RJSCPU2OLA_TEST_96:::When a valid username and password are provided and the Login button is clicked, then the page should be navigated to Home Route and should consist of an HTML main heading element with text content as "Instructions":::15:::', async () => {
    renderWithBrowserRouter(<App />)
    const usernameField = screen.getByLabelText(/USERNAME/i, {
      exact: false,
    })
    const passwordField = screen.getByLabelText(/^PASSWORD/i, {
      exact: false,
    })
    const loginButton = screen.getByRole('button', {
      name: /Login/i,
      exact: false,
    })
    userEvent.type(usernameField, 'rahul')
    userEvent.type(passwordField, 'rahul@2021')
    userEvent.click(loginButton)
    mockGetCookie()
    const headingEl = await screen.findByRole('heading', {
      name: /Instructions/i,
      exact: false,
    })
    expect(headingEl).toBeInTheDocument()
    expect(window.location.pathname).toBe(homeRoutePath)
    restoreGetCookieFns()
  })
})
