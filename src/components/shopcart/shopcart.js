import React, { Component } from 'react';
import { connect } from 'react-redux';
import './shopcart.styl';
import { bindActionCreators } from 'redux';
import * as shopcartActions from '../../store/shopcart/actions';

import Cartcontrol from '../cartcontrol/cartcontrol';

class Shopcart extends Component{
    constructor(props){
        super(props);
        this.state = {
            listShow: false
        }
    }

    componentWillReceiveProps (nextProps, nextState) {
        if(nextProps.totalCount === 0){
            this.setState({
                listShow: false
            })
        }
    }

    pay = (ev) => {
        ev.stopPropagation();
        if(this.props.totalPrice < this.props.minPrice){
            return;
        }
        window.alert(`支付${this.props.totalPrice + this.props.datas.seller.deliveryPrice}元`)
    }

    toggleList = () => {
        if(!this.props.totalPrice){
            return;
        }
        this.setState((prevState)=>({
            listShow: !prevState.listShow
        }))
    }

    hideList = () => {
        this.setState({
            listShow: false
        })
    }

    clear = () => {
        this.props.actions.clearShopcart();
        this.setState({
            listShow: false
        })
    }

    render(){
        const { datas, totalCount, totalPrice, payDesc, selectFoods } = this.props;
        let seller = datas.seller;
        return (
            <div>
                <div className="shopcart">
                    <div className="content" onClick={this.toggleList}>
                        <div className="content-left">
                            <div className="logo-wrapper">
                                <div className={`logo${totalCount>0?' highlight':''}`}>
                                    <i className={`icon-shopping_cart${totalCount>0?' highlight':''}`}></i>
                                </div>
                                <div className={`num${totalCount>0?' show':''}`}>{totalCount}</div>
                            </div>
                            <div className="price">￥</div>`
                            <div className="desc">另需配送费￥{seller.deliveryPrice}元</div>
                        </div>
                        <div className="content-right" onClick={(ev)=>{this.pay(ev)}}>
                            <div className={`pay${(totalPrice>=seller.minPrice)?' enough':' not-enough'}`}>{payDesc ? payDesc : `￥${seller.minPrice}元起送`}</div>
                        </div>
                    </div>
                    
                    <div className={`shopcart-list${this.state.listShow?' show':' hide'}`}>
                        <div className="list-header">
                            <h1 className="title">购物车</h1>
                            <span className="empty" onClick={this.clear}>清空</span>
                        </div>
                        <div className="list-content">
                            <ul>
                                {
                                    selectFoods.map((food, index)=>{
                                        return(
                                            <li className="food" key={index}>
                                                <span className="name">{food.name}</span>
                                                <div className="price">
                                                    <span>￥{food.price*food.count}</span>
                                                </div>
                                                <div className="cartcontrol-wrapper">
                                                    <Cartcontrol food={food}></Cartcontrol>
                                                </div>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                </div>
                <div className={`list-mask${this.state.listShow?' show':' hide'}`} onClick={this.hideList}></div>
            </div>
        )
    }
}

function mapStateToProps(state){
    return {
        datas: state.good.datas,
        totalCount: state.shopcart.totalCount,
        totalPrice: state.shopcart.totalPrice,
        payDesc: state.shopcart.payDesc,
        selectFoods: state.shopcart.selectFoods
    }
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        ...ownProps,
        actions: bindActionCreators({...shopcartActions}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Shopcart);