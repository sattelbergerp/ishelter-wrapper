import React, {Component} from 'react';

export default class Header extends Component{
  render(){
    return (
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">IShelter Wrapper</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="#">Cats</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">Status</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">Diet</a>
              </li>
              <li class="nav-item">
                <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Settings</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}
