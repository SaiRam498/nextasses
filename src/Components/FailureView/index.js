const FailureView = props => {
  const {onClickRetry} = props
  const tryAgain = () => {
    onClickRetry()
  }
  return (
    <div>
      <img
        src="https://res.cloudinary.com/dzlwkon9z/image/upload/c_thumb,w_200,g_face/v1736011729/Group_7519_cut7ci.png"
        alt="failure view"
      />
      <h1>Oops! Something went wrong</h1>
      <p>We are having some trouble</p>
      <button type="button" onClick={tryAgain}>
        Retry
      </button>
    </div>
  )
}
export default FailureView
