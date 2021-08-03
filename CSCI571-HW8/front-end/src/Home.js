import React from 'react';
import { Link } from 'react-router-dom'
import logo from './logo.svg';
import './Home.css';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Form from 'react-bootstrap/Form'
import FormCheck from 'react-bootstrap/FormCheck'
import Switch from "react-switch"
import Card from 'react-bootstrap/Card'
import Badge from 'react-bootstrap/Badge'
import CardGroup from 'react-bootstrap/CardGroup'
import CardDeck from 'react-bootstrap/CardDeck'
import { useParams } from 'react-router-dom';
import { MdShare } from "react-icons/md";
import Modal from 'react-bootstrap/Modal'
import { FacebookShareButton, TwitterShareButton, EmailShareButton } from "react-share";
import { FacebookIcon, TwitterIcon, EmailIcon } from 'react-share'
import { IconContext } from "react-icons";
import Header from './Header'
import LoadSpinner from './LoadSpinner'
import { SERVER_ADDRESS, COLOR_MAP, GetBadge } from './global'
import { Guardian_str, NYTimes_str, sport_str, sports_str } from './global'
import { GuardianFindImage, NYTimesFindImage } from './global'

const NYTimes = 'NYTimes'

const local_ip = '100.68.76.31'

class RowCard extends React.Component {
  constructor(props) {
    super(props)
    this.onShareClick = this.onShareClick.bind(this)
    this.onCardClick = this.onCardClick.bind(this)
    return
  }
  onShareClick(title, url, e) {
    console.log(title, url)
    this.props.onShareClick(title, url)
    e.stopPropagation()
  }
  getBadge(section) {
    return GetBadge(section)
  }
  getMdShare() {
    return <MdShare
      onClick={this.onShareClick.bind(this, this.props.title, this.props.url)}>
    </MdShare>
  }
  onCardClick() {
    let href = '#/detail?source='+this.props.source+'&id='+this.props.id
    window.location.href = href
  }
  render() {
    let section = this.props.section
    let badge = this.getBadge(section)
    let MdShare = this.getMdShare()
    return (
      <Card onClick={this.onCardClick} className='home-card'>
      {/* <Card className='home-card' as={Link} to={'/detail?source='+this.props.source+'&id='+this.props.id}> */}
        <Card.Body className='image'>
          <Card.Img src={this.props.image} />
        </Card.Body>
        <Card.Body>
          <Card.Title>
            {this.props.title}
            {MdShare}
          </Card.Title>
          <Card.Text>{this.props.description}</Card.Text>
          <div className='foot'>
            <Card.Text>{this.props.date}</Card.Text>
            {badge}
          </div>
        </Card.Body>
      </Card>
    )
  }
}

class ShareModal extends React.Component {
  constructor(props) {
    super(props)
    this.hideShare = this.hideShare.bind(this)
  }
  hideShare() {
    this.props.hideShare()
  }
  render() {
    let hashtag = "#CSCI_571_NewsApp"
    return (
      <Modal show={this.props.show} onHide={this.hideShare}>
        <Modal.Header closeButton>{this.props.title}</Modal.Header>
        <Modal.Body>
          <label>Share via</label>
          <div>
            <FacebookShareButton url={this.props.url} hashtag={hashtag}>
              <FacebookIcon round/>
            </FacebookShareButton>
            <TwitterShareButton url={this.props.url} hashtags={["CSCI_571_NewsApp"]}>
              <TwitterIcon round/>
            </TwitterShareButton>
            <EmailShareButton url={this.props.url} subject='#CSCI_571_NewsApp'>
              <EmailIcon round/>
            </EmailShareButton>
          </div>
        </Modal.Body>
      </Modal>
    )
  }
}

class Body extends React.Component {
  constructor(props) {
    super(props)
    this.onShareClick = this.onShareClick.bind(this)
    this.hideShare = this.hideShare.bind(this)
    this.getCards = this.getCards.bind(this)
    this.state = {showShare:false}
    return
  }
  componentDidMount() {
    return
  }
  onShareClick(title, url) {
    this.setState({
      showShare:true,
      share_title:title,
      url:url
    })
    return
  }
  hideShare() {
    this.setState({showShare:false})
  }
  getCards() {
    let cards = null
    if (this.props.source===NYTimes) {
      cards = this.props.result.map(item => {
        return <RowCard
          key={item.url}
          image={item.image}
          title={item.title}
          description={item.abstract}
          date={item.published_date.substr(0,10)}
          section={item.section}
          url={item.url}
          onShareClick={this.onShareClick}
          source={this.props.source}
          id={item.url}
          className={this.props.source}
        />
      })
    }
    else {
      cards = this.props.result.map(item => {
        return <RowCard
          key={item.id}
          image={item.image}
          title={item.webTitle}
          description={item.blocks.body[0].bodyTextSummary}
          date={item.webPublicationDate.substr(0,10)}
          section={item.sectionId}
          url={item.webUrl}
          onShareClick={this.onShareClick}
          source={this.props.source}
          id={item.id}
          className={this.props.source}
        />
      })
    }
    return cards
  }
  render() {
    let cards = this.getCards()
    return (<>
        <CardDeck className='home-card-deck'>
          {cards}
        </CardDeck>
        <ShareModal
          show={this.state.showShare}
          hideShare={this.hideShare}
          title={this.state.share_title}
          url={this.state.url}
        />
    </>)
  }
};

class Home extends React.Component {
  constructor(props) {
    console.log(props)
    super(props)
    let path = props.location.pathname.substr(1)
    this.category = path===''?'home':path
    this.state = {category:this.category}
    this.getNewsCategory = this.getNewsCategory.bind(this)
    this.getNews = this.getNews.bind(this)
  }
  async getNews(source, category) {
    let result = await fetch(SERVER_ADDRESS+'/news/'+source+'/'+category)
    result = await result.json()
    if (source===NYTimes_str) {
      result = result.results
      result = result.map(item => {
        item.image = NYTimesFindImage(item)
        return item
      })
    }
    else {
      result = result.response.results
      result = result.map(item => {
        item.image = GuardianFindImage(item)
        return item
      })
    }
    result = result.slice(0,10)
    this.setState({
      source:source,
      result:result
    })
  }
  getNewsCategory(source, category) {
    // console.log(source, category)
    this.news_category = category
    if(source===Guardian_str&&this.news_category===sports_str)
      this.news_category = sport_str
  }
  componentDidMount() {
    // console.log(this.state)
    this.getNewsCategory(this.props.source, this.category)
    this.getNews(this.props.source, this.news_category)
  }
  componentDidUpdate() {
    if (this.state.source === this.props.source && this.state.result!=null)
      return
    this.getNewsCategory(this.props.source, this.category)
    this.getNews(this.props.source, this.news_category)
  }
  static getDerivedStateFromProps(props, state) {
    // console.log(props)
    // console.log(state)
    if (!state || !state.source)
      return null
    if (props.source!=state.source) {
      state.result = null
      return state
    }
    return null
  }
  render() {
    if (!this.state || !this.state.result || !this.state.source) {
    // if (!this.state || !this.state.info) {
    // if (!this.info) {
    // if (!this.props.source || !this.props.news) {
      return <LoadSpinner/>
    }
    return <Body source={this.state.source} result={this.state.result}/>
    // return <Body source={this.info.source} result={this.info.result}/>
    // return <Body source={this.props.source} result={this.props.news}/>
  }
}

export default Home;

// http://100.68.76.31:3000