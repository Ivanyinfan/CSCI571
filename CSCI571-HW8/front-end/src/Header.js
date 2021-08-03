import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Switch from "react-switch"
import AsyncSelect from 'react-select/lib/Async'
import { IconContext } from "react-icons";
import { FaBookmark, FaRegBookmark } from 'react-icons/fa'
import _ from "lodash";
import { SERVER_ADDRESS, KEYS } from './global'
import { Guardian_str, NYTimes_str, sport_str, sports_str, favourite_str } from './global'
import './Header.css'

var qs = require('qs')

class Header extends React.Component {
  constructor(props) {
    super(props)
    console.log(props)
    let path = props.location.pathname.substr(1)
    path = path===''?'home':path
    let ret = this.getState(path, props.location.search)
    this.state = {
      category:ret.category,
      favouritePage:ret.favouritePage,
      showSwitch:ret.showSwitch,
      value:ret.value,
      searchPage:ret.searchPage
    }
    this.options=null
    this.value=null
    this.sourceChange = this.sourceChange.bind(this)
    this.inputChange = this.inputChange.bind(this)
    this.loadOptions =  this.loadOptions.bind(this)
    this.loadOptions2 = this.loadOptions2.bind(this)
    this.search = this.search.bind(this)
    return
  }
  getState(path, search) {
    console.log(path)
    console.log(search)
    let showSwitch = null
    let favouritePage = null
    if (KEYS.indexOf(path)!=-1 || path.length==0) {
      showSwitch = true
    }
    else {
      showSwitch = false
    }
    favouritePage = path===favourite_str?true:false
    let value = null
    let searchPage = false
    if (path==='search') {
      value = qs.parse(search.substr(1)).q
      searchPage = true
    }
    let ret = new Array()
    ret.category=path
    ret.showSwitch = showSwitch
    ret.favouritePage = favouritePage
    ret.value = value
    ret.searchPage = searchPage
    return ret
  }
  componentDidMount() {
    if (this.props.history) {
      this.props.history.listen(route => {
        console.log(route)
        let path = route.pathname.substr(1)
        path = path===''?'home':path
        let ret = this.getState(path, route.search)
        if(ret.value==null) {
          // console.log(ReactDOM.findDOMNode(this.refs.AsyncSelect))
          ReactDOM.findDOMNode(this.refs.AsyncSelect).value = null
        }
        this.setState({
          category:ret.category,
          showSwitch:ret.showSwitch,
          favouritePage:ret.favouritePage,
          value:ret.value,
          searchPage:ret.searchPage
        })
      })
    }
    fetch(SERVER_ADDRESS+'/source')
    .then(res=>res.json())
    .then(res=>{
      this.setState({source:res.source})
      this.props.onSourceChange(res.source)
    })
  }
  sourceChange(checked) {
    let source = null
    if (checked===true) {
      source = 'Guardian'
    }
    else {
      source = 'NYTimes'
    }
    fetch(SERVER_ADDRESS+'/source/'+source,{method:'post'})
    this.props.onSourceChange(source)
    setTimeout(()=>this.setState({source:source}),100)
    return
  }
  inputChange(value) {
    return
  }
  loadOptions(inputValue, callback) {
    let url = 'https://api.cognitive.microsoft.com/bing/v7.0/suggestions?q='+inputValue
    let key = "26bcf1ac3d4442e99da147d267d4abe0"
    fetch(url,{headers:{"Ocp-Apim-Subscription-Key":key}})
    .then(res=>res.json())
    .then(res=>{
      res = res.suggestionGroups[0].searchSuggestions
      res = res.map(item=>({label:item.displayText,value:item.displayText}))
      console.log(JSON.stringify(res))
      callback(res)
      return res
      // this.setState({options:res})
    })
    // .catch(e => {
    //   console.log('ERROR')
    // })
  }
  loadOptions2(inputValue) {
    return _.debounce(this.loadOptions,1000,{leading:true})
  }
  search(select) {
    let value = select.value
    if (!value || value==='') {
      return
    }
    // let href = '/search?source='+this.props.source+'&q='+value
    let href = '#/search?q='+value
    this.value = value
    window.location.href = href
  }
  getNavLink() {
    const navlinks = KEYS.map((key) => {
      let href = null
      if (key === 'home') {
          href="/"
      }
      else {
          href='/'+key
      }
      let active = key===this.state.category?true:false
      let text = key.replace(/^\S/, s=>s.toUpperCase())
      // return <Nav.Link key={key} href={href} active={active}>{text}</Nav.Link>
      return <Nav.Link as={Link} key={key} to={href} active={active}>{text}</Nav.Link>
    })
    return navlinks
  }
  render() {
    const navlinks = this.getNavLink()
    // console.log(this.state)
    return (
      <Navbar expand="lg" bg="primary" variant="dark" id='Header'>
        {(!this.state.searchPage)&&<AsyncSelect ref='AsyncSelect'
          placeholder='Enter keyword ...'
          // placeholder={this.state.value}
          noOptionsMessage={()=>'No Match'}
          // loadOptions={this.loadOptions}
          // loadOptions={this.loadOptions2}
          // loadOptions={_.debounce(this.loadOptions,1000)}
          loadOptions={_.debounce(this.loadOptions,1000,{leading:true})}
          // onInputChange={_.debounce(this.inputChange,1000,{leading:true})}
          onChange={this.search}
          cacheOptions
          // value={this.value}
          // options={this.options}
          // inputValue={this.value}
          // value = {this.state.value}
          // inputValue = {this.state.value}
          // name={this.state.value}
          // defaultMenuIsOpen={this.state.value}
          // defaultValue={this.state.value}
          // defaultInputValue={this.state.value}
          className='search-select'
        />}
        {this.state.searchPage&&<AsyncSelect ref='AsyncSelect'
          placeholder='Enter keyword ...'
          // placeholder={this.state.value}
          noOptionsMessage={()=>'No Match'}
          // loadOptions={this.loadOptions}
          // loadOptions={_.debounce(this.loadOptions,1000)}
          loadOptions={_.debounce(this.loadOptions,1000,{leading:true})}
          // onInputChange={_.debounce(this.inputChange,1000,{leading:true})}
          onChange={this.search}
          // cacheOptions
          // value={this.value}
          // options={this.options}
          // inputValue={this.value}
          // value = {this.state.value}
          // inputValue = {this.state.value}
          // name={this.state.value}
          // defaultMenuIsOpen={this.state.value}
          // defaultValue={this.state.value}
          defaultInputValue={this.state.value}
          className='search-select'
        />}
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            {navlinks}
          </Nav>
          <IconContext.Provider value={{color:'white'}}>
            <a href='#/favourite' className='bookmark'>
              {this.state.favouritePage?<FaBookmark/>:<FaRegBookmark/>}
            </a>
          </IconContext.Provider>
          {this.state.showSwitch&&<label className='switch'>
            <span>NYTimes</span>
            <Switch
              id='SOURCE'
              onChange={this.sourceChange}
              checked={this.state.source==='Guardian'}
              onColor="#007bff"
              uncheckedIcon={false}
              checkedIcon={false}
              className="react-switch"
            />
            <span>Guardian</span>
          </label>}
        </Navbar.Collapse>
      </Navbar>
    )
  }
}

export default Header;