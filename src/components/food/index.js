import React, { Component } from 'react';
import './index.styl';
import BScroll from 'better-scroll';
import Cartcontrol from '../cartcontrol/cartcontrol';
import Split from '../split/split';
import RatingSelect from '../ratingselect/index';
import { CSSTransitionGroup } from 'react-transition-group';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as shopcartActions from '../../store/shopcart/actions';
import * as goodActions from '../../store/good/actions';

class Food extends Component {
    constructor(props) {
        super(props);
        this.state = {
            needShow: true,
            showFlag: false,
            count: 0
        }
    }

    componentWillReceiveProps (nextProps, nextState) {
        let count = 0;
        let food = nextProps.selectedFood;
        let selectFoods = nextProps.selectFoods;
        if(Object.keys(food).length===0){
            this.setState({
                showFlag: false
            })
        }else{
            this.setState({
                showFlag: true
            })
        }
        for(let i=0;i<selectFoods.length;i++){
            if(food.name===selectFoods[i].name){
                count = selectFoods[i].count;
            }
        }
        this.setState({
            count: count
        })
    }

    componentDidMount () {
        this.initScroll();
    }

    initScroll = () => {
        this.scroll = new BScroll(this.foodNode,{
            click: true
        })
    }

    hide = () => {
        this.props.actions.hideCard();
    }

    getFood = (fd) => {
        this.foodNode = fd;
    }

    needShow = (type, text) => {
        if (this.props.onlyContent && !text) {
            return '';
        }
        if (this.props.selectType === 2) {
            return ' show';
        } else {
            return (type === this.props.selectType)?' show':'';
        }
    }

    //add = (ball, name, price) => {
        //typeof this.props.add === 'function' && this.props.add(ball,name,price);
    //}

    // decrease = (name) => {
    //     typeof this.props.decrease === 'function' && this.props.decrease(name);
    // }

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

    addFirst = () => {
        //let food = this.props.food;
        //typeof this.props.add === 'function' && this.props.add(null,food.name,food.price); // 先不考虑ball
        let sf = this.props.selectFoods;
        let food = this.props.selectedFood;
        let { name, price } = food;
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

    render() {
        
        let ratings,ratingselect;
        const { selectedFood } = this.props;
        let food = selectedFood;

        if(Object.keys(food).length!==0){
            ratings = (
                food.ratings.map((rating,index)=>{
                    return(
                        <li className={`rating-item${this.needShow(rating.rateType,rating.text)}`} key={index}>
                            <div className="user">
                                <span className="name">{rating.username}</span>
                                <img className="avatar" width="12" height="12" src={rating.avatar} alt=""/>
                            </div>
                            <div className="time">{rating.rateTime}</div>
                            <p className="text">
                                <span className={`${(rating.rateType===0)?'icon-thumb_up':''}${(rating.rateType===1)?'icon-thumb_down':''}`}></span>{rating.text}
                            </p>
                        </li>
                    )
                })
            )
            ratingselect = <RatingSelect></RatingSelect>
        }else{
            ratings = '';
            ratingselect = '';
        }

        return (
            <CSSTransitionGroup
                transitionName="move"
                transitionEnterTimeout={300}
                transitionLeaveTimeout={300}>
                <div className={`food${this.state.showFlag?' show':' hide'}`} ref={this.getFood}>
                    <div className="food-content">
                        <div className="image-header">
                            <img src={food.image} alt=""/>
                            <div className="back" onClick={this.hide}>
                                <i className="icon-arrow_lift"></i>
                            </div>
                        </div>
                        <div className="content">
                            <div className="title">{food.name}</div>
                            <div className="detail">
                                <span className="sell-count">月售{food.sellCount}份</span>
                                <span className="rating">好评率{food.rating}%</span>
                            </div>
                            <div className="price">
                                <span className="now">￥{food.price}</span><span className={`old${food.oldPrice?' show':''}`}>￥{food.oldPrice}</span>
                            </div>
                            <div className="cartcontrol-wrapper">
                                <Cartcontrol food={food}></Cartcontrol>
                            </div>
                            <div className={`buy${(!this.state.count || this.state.count===0)?' show':''}`} onClick={this.addFirst}>加入购物车</div> 
                        </div>
                        <Split className={`${food.info?'':'hide'}`}></Split>
                        <div className="rating">
                            <h1 className="title">商品评价</h1>
                            {ratingselect}
                            <div className="rating-wrapper">
                                <ul className={`${(food.ratings&&food.ratings.length)?'':'hide'}`}>
                                    {ratings}
                                </ul>
                                <div className={`no-rating${(!food.ratings || !food.ratings.length)?' show':''}`}>暂无评价</div>
                            </div>
                        </div>
                    </div>
                </div>
            </CSSTransitionGroup>
        );
    }
}

function mapStateToProps(state) {
    return {
        selectedFood: state.good.selectedFood,
        selectFoods: state.shopcart.selectFoods,
        totalCount: state.shopcart.totalCount,
        totalPrice: state.shopcart.totalPrice,
        payDesc: state.shopcart.payDesc,
        datas: state.good.datas,
        onlyContent: state.good.onlyContent,
        selectType: state.good.selectType
    }
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        ...ownProps,
        actions: bindActionCreators({...goodActions, ...shopcartActions}, dispatch)
    } 
}

export default connect(mapStateToProps, mapDispatchToProps)(Food);