import React, { Component } from 'react';
import { BrowserRouter as Router, Route, NavLink as Link } from "react-router-dom";

import './index.styl';
import TopHeader from '../src/components/header/index';
import Good from '../src/components/good/index';
import Ratings from '../src/components/ratings/index';
import Seller from '../src/components/seller/index';

import { connect } from 'react-redux';

import fetch from 'cross-fetch';

// action
function beginFetch() {
  return { type: 'begin' };
}

function receiveDatas(datas) {
  // return dispatch => {
  //   dispatch({type: 'finish', datas: datas});
  //   return dispatch({type: 'rendered'})
  // }
  return { type: 'finish', datas: datas };
}

function fetchData() {
  return dispatch => {
    dispatch(beginFetch());
    return fetch('data.json')
      .then(rs => rs.json())
      .then(datas => dispatch(receiveDatas(datas)));
  }
}

function mapStateToProps(state){
  const { loading, recieved, datas } = state;
  return {
    loading,
    recieved,
    datas
  }
}

class App extends Component {
  // constructor(props){
  //   super(props);
  //   this.state = {
  //     datas: ''
  //   }
  // }

  componentDidMount = () => {
    fetch('data.json').then(rs => {
      rs.json().then(datas => {
        this.setState({
          datas: datas
        });
      })
    })

    const { dispatch } = this.props;

    dispatch(fetchData());
  }

  render() {
    return (
        <Router>
          <div className="App">
              <TopHeader/>
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

export default connect(mapStateToProps)(App);
