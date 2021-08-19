import React, {Component} from 'react';
import CatTestValue from './CatTestValue';

export default class CatTest extends Component{

  constructor(){
    super();
    this.state = {selected: -1, updating: 0};
  }

  componentDidMount(){
    this.setState({selected: this.props.test.selected});
  }

  onSelect = (index, completeCallback)=>{
    this.setState({selected: index});
    this.props.test.selected = index;
    this.props.app.api.cats.updateTest(this.props.test, ()=>{
      completeCallback();
    });
  }

  render(){
    let test = this.props.test;
    return (<div className="cat-test-container">
        <h5 className="cat-test-title">{test.name}</h5>
        <div className="list-group">
          {test.values.map((value, index)=>{
            return (<CatTestValue key={index} index={index} value={value} selected={this.state.selected===index} onSelect={this.onSelect}/>);
          })}
        </div>
      </div>)
  }
}
