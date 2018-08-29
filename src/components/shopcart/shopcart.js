import React, { Component } from 'react';
import { connect } from 'react-redux';
import './shopcart.styl';

import Cartcontrol from '../cartcontrol/cartcontrol';

function mapStateToProps(state){
    let { datas, totalCount, totalPrice, payDesc, selectFoods } = state;
    return { datas, totalCount, totalPrice, payDesc, selectFoods }
}

class Shopcart extends Component{
    constructor(props){
        super(props);
        this.state = {
            //payDesc: '',
            //totalPrice: 0,
            listShow: false
        }
    }

    componentWillReceiveProps (nextProps, nextState) {
        if(nextProps.totalCount === 0){
            this.setState({
                listShow: false
            })
        }
        //this.calculateTotal();
    }

    componentDidMount () {
        // this.setState({
        //     payDesc: `￥${this.props.minPrice}元起送`
        // })
    }

    // calculateTotal = () => {
    //     console.log(1)
    //     let total = 0;
    //     let payDesc = '';
    //     let minPrice = this.props.minPrice;
    //     let totalCount = 0;
    //     this.props.selectFoods.forEach((food)=>{
    //         total += food.price*food.count;
    //         totalCount += food.count;
    //     })
    //     if(total===0){
    //         payDesc = `￥${minPrice}元起送`;
    //         this.setState({listShow:false}); // 购物车没有内容不显示
    //     }else if(total< minPrice){
    //         let diff = minPrice - total;
    //         payDesc = `还差￥${diff}元起送`;
    //     }else{
    //         payDesc = '去结算';
    //     }
    //     const { dispatch } = this.props;
    //     dispatch({
    //         type: 'calculateTotal',
    //         totalPrice: total,
    //         payDesc: payDesc,
    //         totalCount: totalCount
    //     })
    //     // this.setState({
    //     //     totalPrice: total,
    //     //     payDesc: payDesc,
    //     //     totalCount: totalCount
    //     // })
    // }

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
        // typeof this.props.clearShopcart === 'function' && this.props.clearShopcart();
        const { dispatch } = this.props;
        dispatch({type: 'clearShopcart'});
        this.setState({
            listShow: false
        })
    }

    // addFood = (name, price) => {
    //     typeof this.props.addFood === 'function' && this.props.addFood(name, price);
    // }

    // decrease = (name) => {
    //     typeof this.props.decrease === 'function' && this.props.decrease(name);
    // }

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
                                                    <Cartcontrol 
                                                        //add={this.addFood} 
                                                        //decrease={this.decrease} 
                                                        food={food} 
                                                        //selectFoods={this.props.selectFoods}
                                                    ></Cartcontrol>
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

export default connect(mapStateToProps)(Shopcart);