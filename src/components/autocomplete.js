import React, {Component} from 'react';
import './autocomplete.css';

export default class Autocomplete extends Component{

  constructor(){
    super();
    this.state = {selected: 0, focused: false}
  }

  setFocused = (focused)=>{
    this.setState({focused});
  }

  onSubmit = (e)=>{
    if(e)e.preventDefault();
    let values = this.getValues();
    if(values[this.state.selected]){
      this.props.onChange({target:{name: "username", value: values[this.state.selected].value}});
    }
    this.props.onSubmit();
  }

  getValues = ()=>{
    return this.props.values.filter((value)=>{
      let w1 = value.value.toLowerCase();
      let w2 = this.props.value.toLowerCase();
      return w1.startsWith(w2) && w1!==w2;
    });
  }

  handleKeyDown = (e) => {
    if(e.key==='ArrowUp' && this.state.selected > 0){
      e.preventDefault();
      this.setState({selected: this.state.selected-1});
    }
    if(e.key==='ArrowDown' && this.state.selected < this.getValues().length-1){
      e.preventDefault();
      this.setState({selected: this.state.selected+1});
    }
  }

  render(){
    let values = this.getValues();

    let box = (<div className="autocomplete-suggestions-box">
      {values.map((i, index)=>{
        return (<div data-id={index} key={i.value} onClick={this.onValueClick}
            className={"autocomplete-suggestion " + (index===this.state.selected? "selected":"")}>
          {i.value} ({i.label})
        </div>);
      })}
    </div>);


    return (<div>
      <form onSubmit={this.onSubmit}>
        <input autoFocus name="username" type="text" className="form-control" value={this.props.value} onChange={this.props.onChange}
          onFocus={e=>this.setFocused(true)} onBlur={e=>this.setFocused(false)} onKeyDown={this.handleKeyDown}/>
        {box}
      </form>
    </div>);
  }
}
