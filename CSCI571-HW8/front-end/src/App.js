import React from 'react';
import { BrowserRouter, HashRouter, Switch, Route } from 'react-router-dom'
import Detail from './Detail'
import Search from './Search'
import Favourite from './Favourite'
import Header from './Header';
import Home from './Home';
import { loadSpinner } from './LoadSpinner'

// high level comment
// Header
//   props: onSourceChange(source:string) function

class App extends React.Component {
  constructor(pros) {
    super(pros)
    this.onSourceChange = this.onSourceChange.bind(this)
  }
  onSourceChange(source){
    this.setState({source:source})
  }
  render(){
    console.log(this.state)
    return (
      <BrowserRouter>
        <HashRouter>
          <Route render={(props)=><Header {...props} onSourceChange={this.onSourceChange}/>}/>
          {this.state && this.state.source && <>
            <Route exact strict path='/' render={(pros)=><Home {...pros} source={this.state.source}/>}/>
            <Route exact strict path='/world' render={(pros)=><Home {...pros} source={this.state.source}/>} />
            <Route exact path='/politics' render={(pros)=><Home {...pros} source={this.state.source}/>} />
            <Route exact path='/business' render={(pros)=><Home {...pros} source={this.state.source}/>} />
            <Route exact path='/technology' render={(pros)=><Home {...pros} source={this.state.source}/>} />
            <Route exact path='/sports' render={(pros)=><Home {...pros} source={this.state.source}/>} />
          </>}
          <Route exact path='/detail' component={Detail} />
          <Route exact path='/search' component={Search} />
          <Route exact path='/favourite' component={Favourite} />
          <Route exact path='/loadSpinner' component={loadSpinner} />
        </HashRouter>
      </BrowserRouter>
    )
  }
}

export default App