"use strict";

import React from 'react';
import ReactS3Uploader from 'react-s3-uploader';
import { Paper } from 'material-ui';

class ImgUploader extends React.Component {

  constructor(props) {
    super(props);
    this.uploadFinished = this.uploadFinished.bind(this);
    this.state = {
      uploadDetails: null,
      uploadProgress: null,
      uploadError: null,
      articlePicUrl: props.articlePicUrl
    };
  }

  uploadFinished(uploadDetails) {
    let articlePicUrl = '/s3/img/'+uploadDetails.filename;
    this.setState({
      uploadProgress: null,
      uploadDetails: uploadDetails,
      articlePicUrl: articlePicUrl
    });
    this.props.updateImgUrl(articlePicUrl);
  }

  render () {
    let imgUploadProgressJSX;
    let uploadProgress = this.state.uploadProgress;
    if(uploadProgress) {
      imgUploadProgressJSX = (
      <div>
        {uploadProgress.uploadStatusText}
        ({uploadProgress.progressInPercent}%)
      </div>
    );
    } else if(this.state.articlePicUrl) {
      let articlePicStyles = {
        maxWidth: 200,
        maxHeight: 200,
        margin: 'auto'
      };
      imgUploadProgressJSX = <img src={this.state.articlePicUrl}
      style={articlePicStyles} />;
    }

    let uploaderJSX = (
      <ReactS3Uploader
      signingUrl="/s3/sign"
      accept="image/*"
      onProgress={(progressInPercent, uploadStatusText) => {
        this.setState({
          uploadProgress: { progressInPercent, uploadStatusText },
          uploadError: null
        });
      }}
      onError={(errorDetails) => {
        this.setState({
          uploadProgress: null,
          uploadError: errorDetails
        });
      }}
      onFinish={(uploadDetails) => {
        this.uploadFinished(uploadDetails);
      }} />
    );
    return (
      <Paper zDepth={1} style={{padding: 32, margin: 'auto', width:
        300}}>
        {imgUploadProgressJSX}
        {uploaderJSX}
      </Paper>
    );
  }
}


ImgUploader.propTypes = {
  updateImgUrl: React.PropTypes.func.isRequired
};

export default ImgUploader;

