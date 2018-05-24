import React, { Component } from 'react';
import './index.styl';
import Star from '../star/index';
import Split from '../split/split';
import BScroll from 'better-scroll';
import {saveToLocal, loadFromLocal} from '../../common/js/store';

class Seller extends Component{
    constructor(){
        super();
        this.state = {
            seller: '',
            favorite: false
        };
        this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    }

    componentDidMount () {
        fetch('data.json').then(rs => {
            rs.json().then(datas => {
                this.setState({
                    seller: datas.seller
                },this.registerMethod);
            })
        })
    }

    registerMethod = () => {
        this.initScroll();
        this.initPicScroll();
        this.loadFavorite();
    }

    loadFavorite = () => {
        let favorite = loadFromLocal(this.state.seller.name, 'favorite', false);
        this.setState({
            favorite: favorite
        })
    }

    initScroll = () => {
        this.sellerScorll = new BScroll(this.sl,{
            click: true
        })
    }

    initPicScroll = () => {
        let pics = this.state.seller.pics;
        if(pics){
            let picWidth = 120;
            let margin = 6;
            let width = (picWidth + margin) * pics.length - margin;
            this.picList.style.width = width + 'px';
            if(!this.picScroll){
                this.picScroll = new BScroll(this.picsWrapper,{
                    scrollX: true,
                    eventPassthrough: 'vertical'
                });
            }else{
                this.picScroll.refresh();
            }
        }
    }

    toggleFavorite = (ev) => {
        // if (!ev._constructed) {
        //     return;
        // }
        this.setState((prevState)=>({
            favorite: !prevState.favorite
        }), ()=>{
            saveToLocal(this.state.seller.name, 'favorite', this.state.favorite);
        });
    }

    getSeller = (sl) => {
        this.sl = sl;
    }

    getPicsWrapper = (pw) => {
        this.picsWrapper = pw;
    }
    
    getPicList = (pl) => {
        this.picList = pl;
    }

    render(){

        let seller = this.state.seller;

        if(seller===''){
            return ''
        }
        
        let support = '';
        if(seller.supports){
            support = (
            <ul className="supports">
                {
                    seller.supports.map((item,index)=>{return(
                        <li className="support-item border-1px" key={index}>
                            <span className={`icon ${this.classMap[seller.supports[index].type]}`}></span>
                            <span className="text">{seller.supports[index].description}</span>
                        </li>
                    )})
                }
            </ul>)
        }

        return(
            <div className="seller" ref={this.getSeller}>
                <div className="seller-content">
                    <div className="overview">
                        <h1 className="title">{seller.name}</h1>
                        <div className="desc border-1px">
                            <Star size="36" score={seller.score}></Star>
                            <span className="text">({seller.ratingCount})</span>
                            <span className="text">月售{seller.sellCount}单</span>
                        </div>
                        <ul className="remark">
                            <li className="block">
                                <h2>起送价</h2>
                                <div className="content">
                                    <span className="stress">{seller.minPrice}</span>元
                                </div>
                            </li>
                            <li className="block">
                                <h2>商家配送</h2>
                                <div className="content">
                                    <span className="stress">{seller.deliveryPrice}</span>元
                                </div>
                            </li>
                            <li className="block">
                                <h2>平均配送时间</h2>
                                <div className="content">
                                    <span className="stress">{seller.deliveryTime}</span>分钟
                                </div>
                            </li>
                        </ul>
                        <div className="favorite" onClick={(ev)=>{this.toggleFavorite(ev)}}>
                            <span className={`icon-favorite${this.state.favorite?' active':''}`}></span>
                            <span className="text">{this.state.favorite?'已收藏':'收藏'}</span>
                        </div>
                    </div>
                    <Split></Split>
                    <div className="bulletin">
                        <h1 className="title">公告与活动</h1>
                        <div className="content-wrapper border-1px">
                            <p className="content">{seller.bulletin}</p>
                        </div>
                        {support}
                    </div>
                    <Split></Split>
                    <div className="pics">
                        <h1 className="title">商家实景</h1>
                        <div className="pic-wrapper" ref={this.getPicsWrapper}>
                            <ul className="pic-list" ref={this.getPicList} style={this.listStyle}>
                                {
                                    seller.pics.map((pic,index)=>{return(
                                        <li className="pic-item" key={index}>
                                            <img width="120" height="90" src={pic} alt=""/>
                                        </li>
                                    )})
                                }
                            </ul>
                        </div>
                    </div>
                    <Split></Split>
                    <div className="info">
                        <h1 className="title border-1px">商家信息</h1>
                        <ul>
                            {
                                seller.infos.map((info,index)=>{
                                    return(
                                        <li className="info-item" key={index}>{info}</li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

export default Seller;