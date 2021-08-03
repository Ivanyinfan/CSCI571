import React from 'react';
import Badge from 'react-bootstrap/Badge'
// const SERVER_ADDRESS = 'http://100.68.76.31:3001'
const SERVER_ADDRESS = 'http://csci571-hw8.eba-3cduqv7d.us-east-1.elasticbeanstalk.com'
// const SERVER_ADDRESS = 'https://csci-571-hw8-273802.wl.r.appspot.com'
const Guardian_str = 'Guardian'
const NYTimes_str = 'NYTimes'
const sport_str = 'sport'
const sports_str = 'sports'
const favourite_str = 'favourite'
const KEYS = ['home','world','politics','business','technology','sports']
const COLOR_MAP = {
  'world':'#7c4eff',
  'politics':'success',
  'business':'primary',
  'technology':'#cedc39',
  'sport':'warning',
  'sports':'warning',
  'other':'secondary',
  'Guardian':'dark',
  'NYTimes':'light'
}
const GUARDIAN_IMAGE = "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png"
function GuardianFindImage(item) {
  let image = null
  try {
    let assets = item.blocks.main.elements[0].assets
    image = assets[assets.length-1].file
  }
  catch(e) {
    image = GUARDIAN_IMAGE
  }
  return image
}
const NYTIME_IMAGE = "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg"
const NYTIME_IMAGE_BASE = 'https://nyt.com/'
function NYTimesFindImage(item) {
  let image = item.multimedia.find(item => {
    if (item.width>=2000) {
      return item
    }
  })
  image = image===undefined?NYTIME_IMAGE:image.url
  if(image.substr(0,4)!=='http'){
    image = NYTIME_IMAGE_BASE + image
  }
  return image
}
function GetFavourite(default_value=null) {
  try {
    let ret = localStorage.getItem('favourite')
    if (!ret) {
      return default_value
    }
    ret = JSON.parse(ret)
    if (!Array.isArray(ret)) {
      return default_value
    }
    return ret
  }
  catch(e) {
    return default_value
  }
}
function FindInFavourite(favourite, item) {
  for (let i=0;i<favourite.length;++i) {
    let fa = favourite[i]
    if (fa.source===item.source&&fa.id===item.id) {
      return i
    }
  }
  return -1
}
function RemoveFavourite(favourite, item) {
  let index = FindInFavourite(favourite,item)
  if (index===-1) {
    return
  }
  favourite.splice(index,1)
  localStorage.setItem('favourite',JSON.stringify(favourite))
  return favourite
}
function GetBadge(section) {
  if(!section) {
    return null
  }
  // console.log(section)
  let color = COLOR_MAP[section]
  let variant = null
  let badge = null
  if (color===undefined) {
    variant = COLOR_MAP['other']
  }
  else if (color[0]!=='#') {
    variant = color
  }
  // console.log(variant)
  if (variant!=null) {
    badge = <Badge variant={variant}>{section.toUpperCase()}</Badge>
  }
  else {
    badge = <Badge className={section}>{section.toUpperCase()}</Badge>
  }
  return badge
}
export { Guardian_str, NYTimes_str, sport_str, sports_str, favourite_str }
export { SERVER_ADDRESS, KEYS, COLOR_MAP }
export { GuardianFindImage, NYTimesFindImage }
export { GetFavourite, FindInFavourite, RemoveFavourite }
export { GetBadge }