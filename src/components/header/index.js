import React, { Component } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import './index.styl';
import { connect } from 'react-redux';

import Star from '../star/index'

function mapStateToProps(state){
  const { datas } = state;
  return {
    datas
  }
}

class TopHeader extends Component{
    constructor(props){
        super(props);
        this.state = {
            seller: {},
            detailShow: false
        }
        this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    }

    showDetail = () => {
        this.setState({
            detailShow: true
        })
    }

    hideDetail = () => {
        this.setState({
            detailShow: false
        })
    }

    render(){
        const { datas } = this.props;

        if(datas){
            const seller = datas.seller;

            return(
                <div className="header">
                    <div className="content-wrapper">
                        <div className="avatar">
                            <img height='64' width='64' src={seller.avatar} alt=''/>
                        </div>
                        <div className="content">
                            <div className="title">
                                <span className="brand"></span>
                                <span className="name">{seller.name}</span>
                            </div>
                            <div className="description">
                            {seller.description}/{seller.deliveryTime}分钟送达
                            </div>
                            {seller.supports &&
                                <div className="support">
                                    <span className={`icon ${this.classMap[seller.supports[0].type]}`}></span>
                                    <span className="text">{seller.supports[0].description}</span>
                                </div>
                            }
                            {seller.supports &&
                                <div className="support-count" onClick={this.showDetail}>
                                    <span className="count">{seller.supports.length}个</span>
                                    <i className="icon-keyboard_arrow_right"></i>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="bulletin-wrapper" onClick={this.showDetail}>
                        <span className="bulletin-title"></span><span className="bulletin-text">{seller.bulletin}</span>
                        <i className="icon-keyboard_arrow_right"></i>
                    </div>
                    <div className="background">
                        <img src={seller.avatar} width="100%" height="100%" alt=""/>
                    </div>
                    <CSSTransitionGroup 
                        transitionName="fade" 
                        transitionEnterTimeout={300}
                        transitionLeaveTimeout={300}>
                        { this.state.detailShow &&
                        <div className="detail">
                            <div className="detail-wrapper clearfix">
                                <div className="detail-main">
                                    <h1 className="name">{seller.name}</h1>
                                    <div className="star-wrapper">
                                        <Star size='48' score={seller.score}/>
                                    </div>
                                    <div className="title">
                                        <div className="line"></div>
                                        <div className="text">优惠信息</div>
                                        <div className="line"></div>
                                    </div>
                                    {
                                        seller.supports &&
                                        <ul className="supports">
                                            {seller.supports.map((item, index) => 
                                                <li className="support-item" key={index}>
                                                    <span className={`icon ${this.classMap[seller.supports[index].type]}`}></span>
                                                    <span className="text">{seller.supports[index].description}</span>
                                                </li>
                                            )}
                                        </ul>
                                    }
                                    <div className="title">
                                        <div className="line"></div>
                                        <div className="text">商家公告</div>
                                        <div className="line"></div>
                                    </div>
                                    <div className="bulletin">
                                        <p className="content">{seller.bulletin}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="detail-close" onClick={this.hideDetail}>
                                <i className="icon-close"></i>
                            </div>
                        </div>
                        }
                    </CSSTransitionGroup>
                </div>
            )
        } else {
            return ''
        }

        
    }
}

export default connect(mapStateToProps)(TopHeader);