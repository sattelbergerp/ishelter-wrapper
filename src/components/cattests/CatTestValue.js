import React, {Component} from 'react';

export default class CatTestValue extends Component{

  constructor(){
    super();
    this.state = {loading: false};
  }

  onClick = ()=>{
    if(this.state.loading)return;
    this.setState({loading: true});
    this.props.onSelect(this.props.index, ()=>{
      this.setState({loading: false});
    });
  }

  render(){
    return (<div className="cat-test-value" onClick={this.onClick}>
        <div className={"cat-test-value-rb " + (this.state.loading ? " loading" : (this.props.selected?" selected":""))}></div>
        {this.props.value.name}
      </div>);
  }
}
