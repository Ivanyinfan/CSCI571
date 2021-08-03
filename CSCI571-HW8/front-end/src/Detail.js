import React from 'react';
import Card from 'react-bootstrap/Card'
import { FacebookShareButton, TwitterShareButton, EmailShareButton } from "react-share";
import { FacebookIcon, TwitterIcon, EmailIcon } from 'react-share'
import { IconContext } from "react-icons";
import { FaBookmark, FaRegBookmark, FaArrowAltCircleDown } from 'react-icons/fa'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import ReactTooltip from 'react-tooltip';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commentBox from 'commentbox.io';
import smoothscroll from 'smoothscroll-polyfill';
import { SERVER_ADDRESS } from './global'
import { Guardian_str, NYTimes_str } from './global'
import { GuardianFindImage, NYTimesFindImage } from './global'
import { GetFavourite, FindInFavourite, RemoveFavourite } from './global'
import Header from './Header'
import ShareButton from './ShareButton'
import LoadSpinner from './LoadSpinner'
import './Detail.css'

var qs = require('qs')
smoothscroll.polyfill();

let str_favourite = 'favourite'

class DetailCard extends React.Component {
  constructor(props) {
    super(props)
    let isFavourite = true
    let favourite = GetFavourite([])
    let index = FindInFavourite(favourite,props.cardInfo)
    console.log(index)
    if (index===-1) {
      isFavourite = false
    }
    this.state = {
      favourite: isFavourite,
      showBref : true,
      des_class: 'show-bref'
    }
    this.bookmarkClick = this.bookmarkClick.bind(this)
    this.arrowClick = this.arrowClick.bind(this)
    return
  }
  getFavourite() {
    let favourite = localStorage.getItem('favourite')
    if (favourite==null) {
      favourite = []
    }
    else {
      try {
        favourite = JSON.parse(favourite)
      }
      catch(e) {
        localStorage.removeItem(str_favourite)
        favourite = []
      }
    }
    return favourite
  }
  findInFavourite(favourite, item) {
    for (let i=0;i<favourite.length;++i) {
      let fa = favourite[i]
      if (fa.source===item.source&&fa.id===item.id) {
        return i
      }
    }
    return -1
  }
  addFavourite(info) {
    let favourite = this.getFavourite()
    // let item = { info:info }
    let item = info
    if (this.findInFavourite(favourite,item)!==-1) {
      return
    }
    favourite.push(item)
    localStorage.setItem('favourite',JSON.stringify(favourite))
    // console.log(localStorage.getItem('favourite'))
  }
  removeFavourite(info) {
    let favourite = this.getFavourite()
    let item = { source:info.source, id:info.id }
    let index = this.findInFavourite(favourite,item)
    if (index===-1) {
      return
    }
    favourite.splice(index,1)
    localStorage.setItem('favourite',JSON.stringify(favourite))
    // console.log(localStorage.getItem('favourite'))
  }
  bookmarkClick(info) {
    if (this.state.favourite) {
      toast('Removing - '+info.title,{
        className:'toastt'
      })
      this.removeFavourite(info)
    }
    else {
      toast('Saving '+info.title)
      // localStorage.clear()
      this.addFavourite(info)
    }
    this.setState({favourite:!this.state.favourite})
  }
  arrowClick() {
    if(this.state.showBref) {
      this.setState({
        showBref:!this.state.showBref,
        des_class:'show-all'
      })
      setTimeout(()=>{document.getElementById('scroll_start').scrollIntoView({behavior:"smooth"})},500)
    }
    else {
      // window.scrollTo({top:0,left:0,behavior:"smooth"})
      document.getElementById('Header').scrollIntoView({behavior:"smooth"})
      setTimeout(()=>{
        this.setState({
          showBref:!this.state.showBref,
          des_class:'show-bref'
        })
      },500)
      // this.setState({
      //   showBref:!this.state.showBref,
      //   des_class:'show-bref'
      // })
    }
  }
  render() {
    if(!this.state) {
      return null
    }
    let info = this.props.cardInfo
    return(
      <Card className='detail-card'>
        <Card.Header>
          <Card.Title>{info.title}</Card.Title>
          <div className='second-row'>
            <Card.Text>{info.date}</Card.Text>
            <ShareButton url={info.url} showTooltip={true} className='share-button'/>
            <IconContext.Provider value={{color:'red'}}>
              <div onClick={this.bookmarkClick.bind(this,info)} data-tip data-for='Bookmark'>
                {this.state.favourite?<FaBookmark/>:<FaRegBookmark/>}
              </div>
            </IconContext.Provider>
            <ReactTooltip id='Bookmark' effect='solid'>
              <span>Bookmark</span>
            </ReactTooltip>
          </div>
        </Card.Header>
        <Card.Body>
          <Card.Img src={info.image}></Card.Img>
          <Card.Text id='scroll_start' className={this.state.des_class}>{info.description}</Card.Text>
        </Card.Body>
        <Card.Footer>
          <div onClick={this.arrowClick}>
            {this.state.showBref?<IoIosArrowDown/>:<IoIosArrowUp/>}
          </div>
        </Card.Footer>
      </Card>
    )
  }
}

class CommentBox extends React.Component {
  constructor(props) {
    super(props)
    return
  }
  componentDidMount() {
    commentBox('5672158005035008-proj')
  }
  render() {
    return (
      <div id={this.props.id} className='commentbox'></div>
    )
  }
}

class Detail extends React.Component {
  constructor(props) {
    super(props)
    return
  }
  componentDidMount() {
    let params = this.props.location.search
    params = qs.parse(params.substr(1))
    let source = params.source
    let id = params.id
    let request_url = SERVER_ADDRESS+'/detail?source='+source+'&id='+id
    fetch(request_url)
    .then(res=>res.json())
    .then(result=>{
      if (source===Guardian_str) {
        result = result.response
        let image = GuardianFindImage(result.content)
        this.setState({
          cardInfo: {
            title:result.content.webTitle,
            image:image,
            date:result.content.webPublicationDate.substr(0,10),
            description:result.content.blocks.body[0].bodyTextSummary,
            url:result.content.webUrl,
            source:source,
            id:id,
            key:id
          }
        })
      }
      else {
        result = result.response.docs[0]
        this.setState({
          cardInfo:{
            title:result.headline.main,
            image:NYTimesFindImage(result),
            date:result.pub_date.substr(0,10),
            description:result.abstract,
            url:result.web_url,
            source:source,
            id:id,
            key:id
          }
        })
      }
    })
  }
  render() {
    if (!this.state) {
      return (<>
        <LoadSpinner />
      </>)
    }
    return (<>
      <DetailCard cardInfo={this.state.cardInfo} />
      <CommentBox id={this.state.cardInfo.id} />
    </>)
  }
}

export default Detail;

// http://localhost:3000/detail?source=NYTimes&id=https://www.nytimes.com/2020/04/09/sports/soccer/coronavirus-premier-league-players.html
// https://api.nytimes.com/svc/topstories/v2/images/2020/04/08/sports/08virus-soccermoney1/08virus-soccermoney1-superJumbo.jpg
// https://static01.nyt.com/images/2020/04/08/sports/08virus-soccermoney1/08virus-soccermoney1-superJumbo.jpg