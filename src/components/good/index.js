import React, { Component } from 'react';
import './index.styl';
import BScroll from 'better-scroll';
import Shopcart from '../shopcart/shopcart';
import Cartcontrol from '../cartcontrol/cartcontrol';
import Food from '../food/index';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as goodActions from '../../store/good/actions';

class Good extends Component{
    constructor () {
        super();
        this.state = {
            scrollY: 0,
            canScroll: false
        }
        this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
        this.listHeight = [];
        this.currentIndex = 0;
    }

    componentDidUpdate(props){
        if(this.menuWrapper && !this.state.canScroll){
            this.initScroll();
            this.calculateHeight();
        }
    }

    componentDidMount() {
        if(this.menuWrapper && !this.state.canScroll){
            this.initScroll();
            this.calculateHeight();
        }
    }

    initScroll = () => {
        this.menuScroll = new BScroll(this.menuWrapper,{
            click: true
        })
        this.foodScroll = new BScroll(this.foodsWrapper,{
            click: true,
            probeType: 3
        })
        this.foodScroll.on('scroll',(pos) => {
            // 判断滑动方向，避免下拉时分类高亮错误（如第一分类商品数量为1时，下拉使得第二分类高亮）
            if (pos.y <= 0) {
                this.setState({
                    scrollY: Math.abs(Math.round(pos.y))
                },this.computedIndex)
            }
        })
        this.setState({
            canScroll: true
        })
    }

    calculateHeight = () => {
        let foodList = document.getElementsByClassName('food-list');
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < foodList.length; i++) {
            let item = foodList[i];
            height += item.clientHeight;
            this.listHeight.push(height);
        }
    }

    getMenuWrapper = (menuWrapper) =>{
        this.menuWrapper = menuWrapper;
    }

    getFoodsWrapper = (foodsWrapper) => {
        this.foodsWrapper = foodsWrapper;
    }

    computedIndex = () => {
        for (let i = 0; i < this.listHeight.length; i++) {
            let scrollY = this.state.scrollY;   
            let height1 = this.listHeight[i];
            let height2 = this.listHeight[i + 1];
            if (!height2 || (scrollY >= height1 && scrollY < height2)) {
                this.followScroll(i);
                this.currentIndex = i;
                return;
            }
        }
        this.currentIndex = 0;
    }

    followScroll = (index) => {
        let el = document.getElementsByClassName('menu-item')[index];
        this.menuScroll.scrollToElement(el, 300, 0, -100);
    }

    selectMenu = (index,ev) => {
        // if (!ev._constructed) {
        //     return;
        // }
        let el = document.getElementsByClassName('food-list')[index];
        this.foodScroll.scrollToElement(el, 300);
    }

    getShopcart = (sc) => {
        this.shopcart = sc;
    }

    selectFood = (food) => {
        this.props.actions.selectFood(food);
    }

    render () { 
        let { datas } = this.props;
        datas = datas.goods;
 
        if(datas){
            return(
                <div>
                    <div className="goods">
                        <div className="menu-wrapper" ref={this.getMenuWrapper}>
                            <ul>
                                {
                                   datas.map((item,index) => {
                                       return(
                                        <li key={index} className={`menu-item${this.currentIndex===index?' current':''}`}
                                            onClick={(ev) => {this.selectMenu(index,ev)}}>
                                            <span className="text border-1px">
                                                <span className={`icon${item.type>0?' show':''} 
                                                    ${item.type>0?this.classMap[item.type]:''}`}></span>{item.name}
                                            </span>
                                        </li>
                                       )
                                   })
                                }
                            </ul>
                        </div>
                        <div className="foods-wrapper" ref={this.getFoodsWrapper}>
                            <ul>
                                {datas.map((item, index) => {
                                    return(
                                        <li key={`list-${index}`} className="food-list" ref={this.getFoodList}>
                                            <h1 className="title">{item.name}</h1>
                                            <ul>
                                                {item.foods.map((food) => {
                                                    return(
                                                    <li key={`${food.name}`} className="food-item border-1px" onClick={(ev)=>{this.selectFood(food,ev)}}>
                                                        <div className="icon">
                                                            <img width="57" height="57" src={food.icon} alt=""/>
                                                        </div>
                                                        <div className="content">
                                                            <h2 className="name">{food.name}</h2>
                                                            <p className="desc">{food.description}</p>
                                                            <div className="extra">
                                                                <span className="count">月售{food.sellCount}份</span>
                                                                <span>好评率{food.rating}%</span>
                                                            </div>
                                                            <div className="price">
                                                                <span className="now">￥{food.price}</span>
                                                                <span className={`old ${food.oldPrice?'':'hide'}`}>￥{food.oldPrice}</span>
                                                            </div>
                                                            <div className="cartcontrol-wrapper">
                                                                <Cartcontrol food={food}></Cartcontrol>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    )
                                                })}
                                            </ul>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                        <Shopcart ref={this.getShopcart}></Shopcart>
                    </div>
                    <Food></Food>
                </div>
            )
            //return ''
        }else{
           return ''
        }
    }
}

function mapStateToProps(state){
  return {
      datas: state.good.datas
  }
}

function mapDispatchToProps(dispatch, ownProps){
    return {
        ...ownProps,
        actions: bindActionCreators({...goodActions}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Good);