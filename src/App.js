import React, { Component } from 'react';
import { BrowserRouter as Router, Route, NavLink as Link } from "react-router-dom";

import './index.styl';
import TopHeader from '../src/components/header/index';
import Good from '../src/components/good/index';
import Ratings from '../src/components/ratings/index';
import Seller from '../src/components/seller/index';

class App extends Component {
  constructor(){
    super();
    this.state = {
      datas: ''
    }
  }

  componentWillMount = () => {
    fetch('data.json').then(rs => {
      rs.json().then(datas => {
        this.setState({
          datas: datas
        });
      })
    })
  }

  render() {
    let datas = this.state.datas;
    
    if(datas === ''){
      return ''
    }
    
    return (
      <Router>
          <div className="App">
              <TopHeader seller={datas.seller}/>
              <div className="tab border-1px">
                  <div className="tab-item">
                      <Link to='/good' activeClassName="active">商品</Link>
                  </div>
                  <div className="tab-item">
                      <Link to='/ratings' activeClassName="active">评论</Link>
                  </div>
                  <div className="tab-item">
                      <Link to='/seller' activeClassName="active">商家</Link>
                  </div>
              </div>
              <Route path="/good" component={Good}/>
              <Route path="/ratings" component={Ratings}/>
              <Route path="/seller" component={Seller}/>
          </div>
      </Router>
    );  
  }
}

export default App;
