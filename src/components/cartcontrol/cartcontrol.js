import React, { Component } from 'react';
import './cartcontrol.styl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as shopcartActions from '../../store/shopcart/actions';

class Cartcontrol extends Component{
    constructor (props) {
        super(props);
        this.state = {
            count: 0
        }
    }

    calculateTotal = (sf) => {
        let total = 0;
        let payDesc = '';
        let minPrice = this.props.datas.seller.minPrice;
        let totalCount = 0;
        sf.forEach((food)=>{
            total += food.price*food.count;
            totalCount += food.count;
        })
        if(total===0){
            payDesc = `￥${minPrice}元起送`;
            //this.setState({listShow:false}); // 购物车没有内容不显示
        }else if(total< minPrice){
            let diff = minPrice - total;
            payDesc = `还差￥${diff}元起送`;
        }else{
            payDesc = '去结算';
        }
        return {payDesc: payDesc, total: total, totalCount: totalCount}
    }

    addCart = (ev) => {
        ev.stopPropagation();
        let sf = this.props.selectFoods;
        let { name, price } = this.props.food;
        let flag = true;
        if(sf.length){
            for(let i=0;i<sf.length;i++){
                if(sf[i]['name']===name){
                    flag = false; // 已有商品，只需count+1
                    sf[i]['count']++;
                }
            }
            if(flag){
                sf.push({name:name,price:price,count:1})
            }
        }else{
            sf.push({name: name,price: price,count: 1})
        }
        let {payDesc,total,totalCount} = this.calculateTotal(sf);
        this.props.actions.handleFoods(sf, total, payDesc, totalCount);
    }

    decreaseCart = (ev) => {
        ev.stopPropagation();
        let sf = this.props.selectFoods;
        let name = this.props.food.name;
        for(let i=0;i<sf.length;i++){
            if(sf[i]['name']===name){
                if(sf[i]['count']===1){ // 只剩一个的情况下，数组中删除当前对象
                    sf.splice(i,1);
                }else{
                    sf[i]['count']--;
                }
            }
        }
        let {payDesc,total,totalCount} = this.calculateTotal(sf);
        this.props.actions.handleFoods(sf, total, payDesc, totalCount);
    }

    render(){
        const {selectFoods} = this.props;
        let count = 0;
        for(let i = 0; i < selectFoods.length; i++){
            if(selectFoods[i].name === this.props.food.name){
                count = selectFoods[i].count;
            }
        }

        return (
            <div className="cartcontrol">
                <div className={`cart-decrease${count>0?'':' hide'}`} onClick={(ev)=>{this.decreaseCart(ev)}}>
                    <span className="inner icon-remove_circle_outline"></span>
                </div>
                <div className={`cart-count${count>0?'':' hide'}`}>{count}</div>
                <div className="cart-add icon-add_circle" onClick={(ev)=>{this.addCart(ev)}}></div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        selectFoods: state.shopcart.selectFoods,
        totalCount: state.shopcart.totalCount,
        totalPrice: state.shopcart.totalPrice,
        payDesc: state.shopcart.payDesc,
        datas: state.good.datas
    }
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        ...ownProps,
        actions: bindActionCreators({...shopcartActions}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cartcontrol);