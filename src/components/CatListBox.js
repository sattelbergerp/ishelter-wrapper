import React, { Component } from 'react';

export default class CatListBox extends Component {

  constructor(){
    super();
    this.state = {thumb: undefined};
  }

  componentDidMount(){
    this.props.app.api.cats.fetchThumb(this.props.cat, (url)=>{

      var test = new Image();
      test.addEventListener('load', ()=>{
        this.setState({thumb: url});
      });
      test.addEventListener('error', ()=>{
        this.props.app.api.cats.fetchThumb(this.props.cat, (newurl)=>{
          this.setState({thumb: newurl});
        }, true);
      });
      test.src = url;
    });
  }

  render(){
    let divStyle = {};
    if(this.state.thumb)divStyle=Object.assign(divStyle, {'backgroundImage': "url('"+this.state.thumb+"')"});
    return (<div onClick={this.props.onClick} className="catBox" style={{width: this.props.width, animationDelay: 0.05*this.props.index+ 's'}}>
        <div className="catThumb" style={divStyle}></div>
        <span className="catLabel">
          {this.props.cat.name}
          <span className="catHelpLabel">Click to view/edit diagnostic tests.</span>
        </span>
      </div>);
  }
}
