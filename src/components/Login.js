import React, { Component } from 'react';
import Window from './../containers/Window'
import Autosuggest from 'react-autosuggest';
import './autocomplete.css';

export default class Login extends Component{

  constructor(){
    super();
    this.state = {username: '', password: '', text: '', loading: false, error: '', suggestions: []}
    if(localStorage.usernames)this.saved = JSON.parse(localStorage.usernames);
    else this.saved = [];
  }

  getSuggestionsForValue = (value) => {
    value = value.trim().toLowerCase();
    let r = value.length===0? [] : this.saved.filter((v)=>v.value.startsWith(value));
    if(r.length > 3)r.length = 3;
    return r;
  }
  getSuggestionValue = (suggestion)=>suggestion.value;
  renderSuggestion = (v)=>{
    return (<div>{v.value} <span className="autosuggest_user_uname">{v.label}</span></div>);
  };

  doLogin = (e) => {
    e.preventDefault();
    if(this.state.loading)return;
    this.setState({loading: true});
    this.props.app.login(this.state.username, this.state.password, (ok, name)=>{
      if(ok){
        let uname = this.state.username;
        if(!this.saved.find((e)=>e.value===uname))this.saved.push({label: name, value: this.state.username});
        localStorage.usernames = JSON.stringify(this.saved);
      }else{
        this.setState({loading: false, error: 'Incorrect username or password.', password: ''});
      }
    });
  }

  handleInput = (e) => {
    this.setState({[e.target.name]: e.target.value});
  }

  handleUsernameInput = (e, {newValue, method}) => {
    this.setState({username: newValue});
  }

  selectPassword = () => {
    this.passwordInput.focus();
  }

  render(){

    let msg = (<div className="alert alert-primary" role="alert">
      <span>You must sign in to IShelter to continue.</span>
    </div>);
    if(this.state.error){
      msg = (<div className="alert alert-danger" role="alert">
        <span>{this.state.error}</span>
      </div>);
    }

    let loginContent = (<div>
      {msg}
      <form onSubmit={(e)=>{e.preventDefault();this.selectPassword();}}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <Autosuggest inputProps={{name: "username", className:"form-control", value:this.state.username, onChange:this.handleUsernameInput}}
          suggestions={this.state.suggestions}
          onSuggestionsFetchRequested={(v)=>this.setState({suggestions: this.getSuggestionsForValue(v.value)})}
          onSuggestionsClearRequested={()=>this.setState({suggestions: []})}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}/>
        </div>
        <input type="submit" style={{display: "none"}} />
      </form>
      <form onSubmit={this.doLogin}>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input ref={(i)=>{this.passwordInput = i;}} name="password" type="password" className="form-control"
            value={this.state.password} onChange={this.handleInput}/>
        </div>
        <input type="submit" style={{display: "none"}} />
      </form>
    </div>);

    let controlContent = (<button onClick={this.doLogin} className="btn btn-primary"
      disabled={!this.state.username || !this.state.password || this.state.loading}>
      {this.state.loading? "Signing In...": "Sign In"}</button>);

    return <Window title="Authentication Required" content={loginContent} controls={controlContent}/>;

  }

}
