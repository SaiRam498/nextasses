import {BrowserRouter} from 'react-router-dom'

import {render, screen} from '@testing-library/react'

import App from '../App'

const notFoundRoutePath = '/bad-path'

const renderWithBrowserRouter = (ui, {route = '/'} = {}) => {
  window.history.pushState({}, 'Test page', route)
  return render(ui, {wrapper: BrowserRouter})
}

describe(':::RJSCPU2OLA_TEST_SUITE_4:::Not Found Route tests', () => {
  it(':::RJSCPU2OLA_TEST_97:::When the "/bad-path" is provided as the URL, then the page should be navigated to NotFound Route and consist of an HTML image element with alt attribute value as "not found":::5:::', () => {
    renderWithBrowserRouter(<App />, {route: notFoundRoutePath})
    const imageEl = screen.getByRole('img', {name: /not found/i, exact: false})
    expect(imageEl).toBeInTheDocument()
  })

  it(':::RJSCPU2OLA_TEST_98:::When the "/bad-path" is provided as the URL, then the page should be navigated to NotFound Route and consist of an HTML main heading element with text content as "Page Not Found":::5:::', () => {
    renderWithBrowserRouter(<App />, {route: notFoundRoutePath})
    expect(
      screen.getByRole('heading', {
        name: /Page Not Found/i,
        exact: false,
      }),
    ).toBeInTheDocument()
  })

  it(':::RJSCPU2OLA_TEST_99:::When the "/bad-path" is provided as the URL, then the page should be navigated to NotFound Route and consist of an HTML paragraph element with text content as "We are sorry, the page you requested could not be found":::5:::', () => {
    renderWithBrowserRouter(<App />, {route: notFoundRoutePath})
    const paragraphEl = screen.getByText(
      /We are sorry, the page you requested could not be found/i,
      {
        exact: false,
      },
    )
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')
  })
})
