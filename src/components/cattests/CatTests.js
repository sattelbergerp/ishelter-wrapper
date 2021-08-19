import React, { Component } from 'react';
import CatTest from './CatTest';
import Window from './../../containers/Window';
import './CatTests.css';

export default class CatTests extends Component {

  constructor(){
    super();
    this.state = {tests: [], loading: true};

  }

  back = ()=>{
    window.history.back();
  }

  componentDidMount(){
    this.props.app.api.cats.fetchTests(this.props.cat, (tests)=>{
      this.setState({tests: tests, loading: false});
    });
  }

  render(){
    let list = (<div className="loader"></div>)
    if(!this.state.loading){
      list = (<div>{this.state.tests.map((test, index)=>{
        return (<CatTest app={this.props.app} test={test} key={index} />);
      })}</div>);
    }
    return (<Window title={this.props.cat.name} content={list} onClose={this.back}/>);

  }
}
