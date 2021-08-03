import React from 'react';
import Modal from 'react-bootstrap/Modal'
import ShareButton from './ShareButton'

class ShareModal extends React.Component {
  constructor(props) {
    super(props)
    this.hideShare = this.hideShare.bind(this)
  }
  hideShare() {
    this.props.hideShare()
  }
  render() {
    return (
      <Modal show={this.props.show} onHide={this.hideShare}>
        <Modal.Header closeButton>{this.props.title}</Modal.Header>
        <Modal.Body>
          <label>Share via</label>
          <ShareButton url={this.props.url} showTooltip={false}/>
        </Modal.Body>
      </Modal>
    )
  }
}

export default ShareModal;