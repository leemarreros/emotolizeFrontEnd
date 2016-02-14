'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Display from './Display.js';
import io from 'socket.io-client';
import dataEmotion from '../data.js';

export default class Login extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      response: null,
      FB: null,
      userInfo: null,
      title: null,
      status: 'disconnected',
      streamData: null,
      isEndTransmition: false,
    };
  }

  componentDidMount() {
    this.connect();
    this.streaming();
    // this.socket.emit('streamingNow', {id: 'sup'});
  }

  componentWillMount() {
    // this.socket = io('ec2-54-200-226-3.us-west-2.compute.amazonaws.com/emo-socket');
    // this.socket.on('connect', this.connect.bind(this));
    // this.socket.on('stream', this.streaming);
    // this.socket.on('endstream', this.endStream);
    // this.socket.on('error', this.error);

    window.fbAsyncInit = function() {
      FB.init({
        appId      : '1528085177508710',
        xfbml      : true,
        version    : 'v2.5'
      });

      FB.getLoginStatus(function(response){
        // console.log('initialize response', response);
        this.setState({response, FB});
        if (response.status) this.retrieveUserInfo();
      }.bind(this));

    }.bind(this);

    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v2.5";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

  }

  connect(data) {
    //title of event, data
    console.log('connected', data);
    this.setState({
      status: 'connected',
      title: 'Developer Week Emotion Recognition',
      date: new Date()});
  }

  streaming(data) {
    console.log('streaming', data)
    this.setState({streamData: dataEmotion});
  }

  endStreamEvent(data) {
    this.setState({isEndTransmition: true});
  }

  retrieveUserInfo() {
    FB.api('/me?fields=id,name,picture', function(userInfo) {
      // console.log('retrieving data', userInfo);
      // console.log(userInfo);
      this.setState({userInfo});
    }.bind(this));

    FB.api(
      "...?fields={fieldname_of_type_ProfilePictureSource}",
      function (response) {
        if (response.error){/*console.log(response.error)*/};
        if (response && !response.error) {
          /* handle the result */
          // console.log('api', response);
        }
      }
    );
  }

  onLoginPress() {
    FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        // console.log('already logged in');
        this.retrieveUserInfo()
      } else if (response.status === 'not_authorized') {
        // console.log('not_authorized');
      } else {
        // console.log('Please, log in into FB.');
        FB.login(function(response){
          if (response.status === 'connected') this.retrieveUserInfo();
          this.setState({response});
        }.bind(this), {scope: 'user_photos'});
      }
    }.bind(this));
  }

  setStateResponse(response) {
    this.setState({response});
  }

  render() {
    return (
      <Display
            userInfo={this.state.userInfo}
            status={this.state.status}
            isEndTransmition={this.state.isEndTransmition}
            streamData={this.state.streamData}
            title={this.state.title}
            date={this.state.date}
            endStreamEvent={this.endStreamEvent.bind(this)}/>

      )
    if (this.state.response === null) {
      return <div>Loading</div>
    }
    return (
      <div>
        {this.state.response.status === "connected" ?
          <Display
            userInfo={this.state.userInfo}
            status={this.state.status}
            isEndTransmition={this.state.isEndTransmition}
            streamData={this.state.streamData}
            title={this.state.title}
            date={this.state.date}
            endStreamEvent={this.endStreamEvent.bind(this)}/>
          :
        <div className="wrapperLogin">
          <span><h1 className="title">Emotolize</h1></span>
          <span><h1 className="subtitle">Emotion recognition app</h1></span>
          <img className='osmoImage' src={'../img/osmo_camera_1.png'}/>
          <img onClick={this.onLoginPress.bind(this)} className='fbButton' src={'../img/fb-login-button.png'}/>
        </div>
        }
      </div>
      );
  }
};
