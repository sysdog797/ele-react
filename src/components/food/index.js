import React, { Component } from 'react';
import './index.styl';
import BScroll from 'better-scroll';
import Cartcontrol from '../cartcontrol/cartcontrol';
import Split from '../split/split';
import RatingSelect from '../ratingselect/index';
import { CSSTransitionGroup } from 'react-transition-group';

class Food extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectType: 2,
            onlyContent: true,
            needShow: true
        }
        this.showFlag = false;
    }

    componentWillReceiveProps () {
        this.count = 0;
        let food = this.props.food;
        let selectFoods = this.props.selectFoods;
        if(Object.keys(food).length===0){
            this.showFlag = false;
        }else{
            this.showFlag = true;
        }
        for(let i=0;i<selectFoods.length;i++){
            if(food.name===selectFoods[i].name){
                this.count = selectFoods[i].count;
            }
        }
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
        this.showFlag = false;
        this.setState({onlyContent:true,selectType:2});
        typeof this.props.hideCard === 'function' && this.props.hideCard();
    }

    getFood = (fd) => {
        this.foodNode = fd;
    }

    selectRating = (type) => {
        this.setState({
            selectType: type
        })
        this.scroll.refresh();
    }

    toggleContent = () => {
        this.setState((prevState)=>({
            onlyContent: !prevState.onlyContent
        }))
    }

    needShow = (type, text) => {
        if (this.state.onlyContent && !text) {
            return '';
        }
        if (this.state.selectType === 2) {
            return ' show';
        } else {
            return (type === this.state.selectType)?' show':'';
        }
    }

    add = (ball, name, price) => {
        typeof this.props.add === 'function' && this.props.add(ball,name,price);
    }

    decrease = (name) => {
        typeof this.props.decrease === 'function' && this.props.decrease(name);
    }

    addFirst = () => {
        let food = this.props.food;
        typeof this.props.add === 'function' && this.props.add(null,food.name,food.price); // 先不考虑ball
    }

    render() {
        
        let food = this.props.food;
        let ratings,ratingselect;

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
            ratingselect = (<RatingSelect 
                                select={this.selectRating}
                                ratings={food.ratings}
                                selectType={this.state.selectType}
                                toggle={this.toggleContent}
                                onlyContent={this.state.onlyContent}>
                            </RatingSelect>)
        }else{
            ratings = '';
            ratingselect = '';
        }

        return (
            <CSSTransitionGroup
                transitionName="move"
                transitionEnterTimeout={300}
                transitionLeaveTimeout={300}>
                <div className={`food${this.showFlag?' show':' hide'}`} ref={this.getFood}>
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
                                <Cartcontrol
                                    food={this.props.food}
                                    selectFoods={this.props.selectFoods}
                                    add={this.add} 
                                    decrease={this.decrease}
                                ></Cartcontrol>
                            </div>
                            <div className={`buy${(!this.count || this.count===0)?' show':''}`} onClick={this.addFirst}>加入购物车</div> 
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

export default Food;