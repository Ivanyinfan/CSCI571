import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Home from './Home';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter, HashRouter, Switch, Route } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import { toast, Zoom } from 'react-toastify';
import App from './App'
import Detail from './Detail'
import Search from './Search'
import Favourite from './Favourite'
import Header from './Header';
import { loadSpinner } from './LoadSpinner'
import { SERVER_ADDRESS } from './global'
import './mobile.scss'

toast.configure({
  position:'top-center',
  autoClose:3000,
  hideProgressBar:true,
  transition:Zoom
})

function Index() {
  let isMobile = useMediaQuery({query:'(max-device-width:1000px)'})
  let classs = null
  console.log(isMobile)
  if (isMobile) {
    classs = 'mobile'
  }
  else {
    classs = 'desktop'
  }
  return (
    <div className={classs}>
      <App />
    </div>
  )
}

ReactDOM.render(
  // <React.StrictMode>
    <Index />,
  // </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
