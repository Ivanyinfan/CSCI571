import React from 'react';
import Card from 'react-bootstrap/Card'
import CardDeck from 'react-bootstrap/CardDeck'
import { MdShare } from "react-icons/md";
import { SERVER_ADDRESS, Guardian_str } from './global'
import { GuardianFindImage, GetBadge } from './global'
import Header from './Header'
import ShareModal from './ShareModal'
import LoadSpinner from './LoadSpinner'
import './Search.scss'

var qs = require('qs')

class SearchCard extends React.Component {
  constructor(props) {
    super(props)
    this.shareClick = this.shareClick.bind(this)
    this.cardClick = this.cardClick.bind(this)
    return
  }
  shareClick(title, url, e) {
    console.log(title, url)
    this.props.onShareClick(title, url)
    e.stopPropagation()
  }
  cardClick(info) {
    let href = '#/detail?source='+info.source+'&id='+info.id
    window.location.href = href
  }
  render() {
    let info = this.props.info
    return (
      <Card onClick={this.cardClick.bind(this,info)} className='search-card'>
        <Card.Header>
          <Card.Title>
            {info.title}
            <MdShare onClick={this.shareClick.bind(this, info.title, info.url)}/>
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <Card.Img src={info.image} />
        </Card.Body>
        <Card.Footer>
          <Card.Text>{info.date}</Card.Text>
          {GetBadge(info.section)}
        </Card.Footer>
      </Card>
    )
  }
}

class Result extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showShare:false
    }
    this.hideShare = this.hideShare.bind(this)
    this.onShareClick = this.onShareClick.bind(this)
  }
  componentDidMount() {
    fetch(SERVER_ADDRESS+'/search/'+this.props.keyword)
    .then(res => res.json())
    .then(res => {
      res = res.response.results
      if (this.props.source===Guardian_str) {
        res = res.map(item => {
          let ret = {}
          ret.title = item.webTitle
          ret.image = GuardianFindImage(item)
          ret.section = item.sectionId
          ret.date = item.webPublicationDate.substr(0,10)
          ret.key = item.id
          ret.url = item.webUrl
          ret.source = this.props.source
          ret.id = item.id
          return ret
        })
      }
      this.setState({result:res})
    })
  }
  onShareClick(title, url) {
    this.setState({
      showShare:true,
      share_title:title,
      share_url:url
    })
    return
  }
  hideShare() {
    this.setState({showShare:false})
  }
  render() {
    if (!this.state || !this.state.result) {
      return <LoadSpinner/>
    }
    if (!this.state.result.length) {
      return null
    }
    return (<>
      <h3 className='search-result'>Results</h3>
      <CardDeck className='search-card-deck'>
        {this.state.result.map(item=><SearchCard key={item.key} info={item} onShareClick={this.onShareClick}/>)}
      </CardDeck>
      <ShareModal
        show={this.state.showShare}
        hideShare={this.hideShare}
        title={this.state.share_title}
        url={this.state.share_url}
      />
    </>)
  }
}

class Search extends React.Component {
  constructor(props) {
    super(props)
    let params = this.props.location.search
    params = qs.parse(params.substr(1))
    // this.source = params.source
    this.source = Guardian_str
    this.keyword = params.q
  }
  render() {
    return (<>
      <Result source={this.source} keyword={this.keyword} />
    </>)
  }
}

export default Search;

// https://content.guardianapis.com/search?q=coronavirus&api-key=0b2a4b89-5aab-4f29-9679-9047b215cbad&show-blocks=all
// http://100.68.76.31:3000/search?source=Guardian&q=coronavirus