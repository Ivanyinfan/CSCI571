import React from 'react';
import { FacebookShareButton, TwitterShareButton, EmailShareButton } from "react-share";
import { FacebookIcon, TwitterIcon, EmailIcon } from 'react-share'
import ReactTooltip from 'react-tooltip';

class ShareTooltip extends React.Component {
  render() {
    return (
      // <ReactTooltip id={'ShareTooltip_'+this.props.name} effect='solid'>
      <ReactTooltip id={this.props.name} effect='solid'>
        <span>{this.props.name}</span>
      </ReactTooltip>
    )
  }
}

class ShareButton extends React.Component {
  constructor(props) {
    super(props)
    return
  }
  render() {
    return (<div className={this.props.className}>
      <FacebookShareButton url={this.props.url} hashtag={"#CSCI_571_NewsApp"} data-tip data-for="Facebook">
        <FacebookIcon round/>
      </FacebookShareButton>
      <TwitterShareButton url={this.props.url} hashtags={["CSCI_571_NewsApp"]} data-tip data-for="Twitter">
        <TwitterIcon round/>
      </TwitterShareButton>
      <EmailShareButton url={this.props.url} subject='#CSCI_571_NewsApp' data-tip data-for="Email">
        <EmailIcon round/>
      </EmailShareButton>
      {this.props.showTooltip&&<>
      <ShareTooltip name='Facebook' />
      <ShareTooltip name='Twitter' />
      <ShareTooltip name='Email' /></>}
    </div>)
  }
}

export default ShareButton;