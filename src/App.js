import React, { Component } from 'react';
import Login from './components/Login';
import IShelterApi from './api/IShelter/api'
import './App.css';
import './AppMediaQueries.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import CatTests from './components/cattests/CatTests'
import CatListBox from './components/CatListBox'
import GlobalError from './components/globalerror'
import Header from './components/Header';


class App extends Component {

  constructor(){
    super();
    this.state = {cats: undefined, loginNeeded: false, selected: undefined, tileWidth: 100.0/this.computeVisibleTileCount(), error: null}

    this.api = new IShelterApi(window.webkitConvertPointFromPageToNode, this.onNetworkError);
    this.api.onLoginNeeded = ()=>{
      this.setState({loginNeeded: true});
    }
    window.onpopstate=()=>{
      this.selectCat(null);
    }
  }

  onNetworkError = (error) => {
    console.log(error);
    this.setState({error: error});
  }

  login(username, password, callback){
    this.api.login(username, password, (res, name)=>{
      this.setState({loginNeeded: !res});
      callback(res, name);
    });
  }

  componentDidMount(){
    this.api.cats.fetchCats(['In the Shelter', 'Isolation Room'], (cats)=>{
      this.setState({cats: cats});
    });
    window.addEventListener("resize", this.onResize);
  }

  computeVisibleTileCount(){
    let winWidth = window.innerWidth;
    if(winWidth <= 600)return 1;
    let count = 1;
    while(count < 100){
      let tWidth = winWidth/count;
      if(tWidth < 350)break;
      count++;
    }
    return count;
  }

  onResize = () => {
    let count = this.computeVisibleTileCount();
    if(100.0/count !== this.state.tileWidth){
      this.setState({tileWidth: 100.0/count});
    }
  }

  selectCat(cat){
    if(cat && !this.state.selected){
      window.history.pushState(cat, cat.name,cat.name);
    }
    this.setState({selected: cat});
  }

  render() {
    if(this.state.error)return <GlobalError error={this.state.error}/>;
    let loginUi=(<div />);
    if(this.state.loginNeeded)loginUi=(<Login app={this}/>)

    let cats=(<div className="loader center"></div>);
    if(this.state.cats){
      cats = (
        <div className="catsList">{
          this.state.cats.map((cat, index)=>{
            return (<CatListBox key={index} index={index} width={this.state.tileWidth+"%"} onClick={()=>this.selectCat(cat)} cat={cat} app={this}/>);
          })
        }

      </div>);
    }

    let catTests = (<div />);
    if(this.state.selected)catTests = (<CatTests app={this} cat={this.state.selected}/>);

    return (
        <div className="mainView">
          <Header />
          {cats}
          {catTests}
          {loginUi}
          
        </div>
    );
  }
}

export default App;
