import React from 'react'
import Spinner from 'react-bootstrap/Spinner'
import BounceLoader from 'react-spinners/BounceLoader'
import Header from './Header'

class LoadSpinner extends React.Component {
  render() {
    return (
      <div className='load-spinner'>
        <BounceLoader size={40} color='#007bff'/>
        <span>Loading</span>
      </div>
    )
  }
}

class loadSpinner extends React.Component {
  render() {
    return (<>
      <Header showSwitch={false} />
      <LoadSpinner />
    </>)
  }
}

export default LoadSpinner;
export { loadSpinner };