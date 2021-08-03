import React from 'react'
import Card from 'react-bootstrap/Card'
import CardDeck from 'react-bootstrap/CardDeck'
import { MdShare, MdDelete } from "react-icons/md";
import { toast } from 'react-toastify';
import { Guardian_str, NYTimes_str } from './global'
import { GetFavourite, FindInFavourite, RemoveFavourite } from './global'
import { GetBadge } from './global'
import Header from './Header'
import ShareModal from './ShareModal'
import './Favourite.scss'

class FavouriteCard extends React.Component {
  shareClick(title, url, e) {
    console.log(title, url)
    this.props.onShareClick(title, url)
    e.stopPropagation()
  }
  removeFavourite(info, e) {
    this.props.removeFavourite(info)
    e.stopPropagation()
  }
  cardClick(info) {
    let href = '#/detail?source='+info.source+'&id='+info.id
    window.location.href = href
  }
  render() {
    let info = this.props.info
    return (
      <Card onClick={this.cardClick.bind(this,info)}>
        <Card.Header>
          <Card.Text>
            {info.title}
            <MdShare onClick={this.shareClick.bind(this, info.title, info.url)}/>
            <MdDelete onClick={this.removeFavourite.bind(this,info)}/>
          </Card.Text>
        </Card.Header>
        <Card.Body>
          <Card.Img src={info.image}/>
        </Card.Body>
        <Card.Footer>
          <Card.Text>{info.date}</Card.Text>
          {GetBadge(info.section)}
          {info.source===Guardian_str?GetBadge(Guardian_str):GetBadge(NYTimes_str)}
        </Card.Footer>
      </Card>
    )
  }
}

class Body extends React.Component {
  constructor(props) {
    super(props)
    this.state={showShare:false}
    let f = GetFavourite([])
    this.state={
      favourite:f,
      showShare:false
    }
    this.onShareClick = this.onShareClick.bind(this)
    this.hideShare = this.hideShare.bind(this)
    this.removeFavourite = this.removeFavourite.bind(this)
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
  removeFavourite(item) {
    toast('Removing '+item.title)
    let fa = RemoveFavourite(this.state.favourite, item)
    this.setState({favourite:fa})
  }
  render() {
    let favourite = this.state.favourite
    console.log(favourite)
    let cards = favourite.map(item=>(
      <FavouriteCard
        key={item.key}
        info={item}
        onShareClick={this.onShareClick}
        removeFavourite={this.removeFavourite}
      />
    ))
    if (!cards.length) {
      return <p className='favourite-result'>You have no saved articles</p>
    }
    return (<>
      <h3 className='favourite-result'>Favourites</h3>
      <CardDeck className='favourite-card-deck'>
        {cards}
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

class Favourite extends React.Component {
  render() {
    return (<>
      <Body/>
    </>)
  }
}

export default Favourite;