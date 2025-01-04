import Loader from 'react-loader-spinner'

const LoaderView = () => (
  <div className="loader-container" data-testid="loader">
    <Loader type="ThreeDots" color="#263868" height={50} width={50} />
  </div>
)

export default LoaderView
