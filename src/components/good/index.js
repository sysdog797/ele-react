import React, { Component } from 'react';
import './index.styl';
import BScroll from 'better-scroll';
import Shopcart from '../shopcart/shopcart';
import Cartcontrol from '../cartcontrol/cartcontrol';
import Food from '../food/index';

class Good extends Component{
    constructor () {
        super();
        this.state = {
            datas: '',
            scrollY: 0,
            seller: '',
            selectFoods: [],
            selectedFood: {}
        }
        this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
        this.listHeight = [];
        this.currentIndex = 0;
    }

    componentDidMount () {
        fetch('data.json').then(rs => {
            rs.json().then(datas => {
                this.setState({
                    datas: datas.goods,
                    seller: datas.seller
                },this.registerMethod);
            })
        })
    }

    registerMethod = () => {
        this.initScroll();
        this.calculateHeight();
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

    addFood = (name, price) => {
        let sf = this.state.selectFoods;
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
        this.setState({
            selectFoods: sf
        })
    }

    decrease = (name) => {
        let sf = this.state.selectFoods;
        for(let i=0;i<sf.length;i++){
            if(sf[i]['name']===name){
                if(sf[i]['count']===1){ // 只剩一个的情况下，数组中删除当前对象
                    sf.splice(i,1);
                }else{
                    sf[i]['count']--;
                }
            }
        }
        this.setState({
            selectFoods: sf
        },()=>{
            this.forceUpdate();
        })
    }

    getShopcart = (sc) => {
        this.shopcart = sc;
    }

    clearShopcart = () => {
        this.setState({
            selectFoods: []
        },()=>{
            this.forceUpdate(); // 强制刷新了
        })
    }

    selectFood = (food, ev) => {
        // if (!ev._constructed) {
        //     return;
        // }
        this.setState({
            selectedFood: food
        },()=>{
            this.forceUpdate();
        })
    }

    hideCard = () => {
        this.setState({
            selectedFood: {}
        },()=>{
            this.forceUpdate();
        })
    }

    render () {
        
        let datas = this.state.datas;   

        if(datas === ''){
            return ''
        }

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
                                                        <Cartcontrol 
                                                            add={this.addFood} 
                                                            decrease={this.decrease} 
                                                            food={food} 
                                                            selectFoods={this.state.selectFoods}>
                                                        </Cartcontrol>
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
                <Shopcart 
                    ref={this.getShopcart}
                    deliveryPrice={this.state.seller.deliveryPrice}
                    minPrice={this.state.seller.minPrice}
                    selectFoods={this.state.selectFoods}
                    clearShopcart={this.clearShopcart}
                    addFood={this.addFood}
                    decrease={this.decrease}></Shopcart>
            </div>
            <Food add={this.addFood} decrease={this.decrease} food={this.state.selectedFood} selectFoods={this.state.selectFoods} hideCard={this.hideCard}></Food>
        </div>
        )
    }
}

export default Good;