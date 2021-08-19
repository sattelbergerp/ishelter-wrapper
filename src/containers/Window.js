import React from 'react'

export default (props)=>{

  let xBtn = (<span></span>);
  if(props.onClose){
    xBtn = (<button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={props.onClose}>
      <span aria-hidden="true">&times;</span>
    </button>);
  }

  let closeBtn = (<span></span>);
  if(props.onClose){
    closeBtn = (<button type="button" className="btn btn-secondary" onClick={props.onClose}>Close</button>);
  }

  return (<div className="modal fade show" style={{display: 'block'}}>
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{props.title || "Undefined"}</h5>
                  {xBtn}
                </div>
                <div className="modal-body">
                  {props.content || "Undefined"}
                </div>
                <div className="modal-footer">
                  {props.controls || ""}
                  {closeBtn}
                </div>
              </div>
            </div>
    </div>);
}
