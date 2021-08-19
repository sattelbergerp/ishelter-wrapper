import React, { Component } from 'react';
import './globalerror.css';

export default class Error extends Component{
  render(){
    return (<div className="global-error-container">
      <h2 className="error-header">An error occured. Please restart the application.</h2>
      <div className="error-btn-container-right">
          <a className="error-btn" href="javascript:window.location.reload()">RESTART</a> <a className="error-btn" href="javascript:void(0)">QUIT</a>
      </div>
      </div>)
  }
}
