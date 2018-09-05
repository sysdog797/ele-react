import React, { Component } from 'react';
import './index.styl';
import BScroll from 'better-scroll';
import {formatDate} from '../../common/js/date';

import Star from '../star/index';
import Split from '../split/split';
import RatingSelect from '../ratingselect/index';

import { connect } from 'react-redux';

class Ratings extends Component{
    constructor(){
        super();
        this.state = {
            needShow: true,
            initScroll: false
        }
    }

    componentDidMount(){
        if(this.ratings && !this.state.initScroll){
            this.initScroll();
            this.setState({
                initScroll: true
            })
        }
    }

    componentDidUpdate(){
        if(this.ratings && !this.state.initScroll){
            this.initScroll();
            this.setState({
                initScroll: true
            })
        }
    }

    initScroll = () => {
        this.ratingScroll = new BScroll(this.ratings,{
            click: true
        })
    }

    getRatings = (ratings) => {
        this.ratings = ratings;
    }

    needShow = (type, text) => {
        if (this.props.onlyContent && !text) {
            return '';
        }
        if (this.props.selectType === 2) {
            return ' show';
        } else {
            return type === this.props.selectType ? ' show' : '';
        }
    }

    render(){
        let { datas } = this.props;
        let ratings = datas.ratings;
        let seller = datas.seller;

        if(!datas){
            return ''
        }

        return(
            <div className="ratings" ref={this.getRatings}>
                <div className="ratings-content">
                    <div className="overview">
                        <div className="overview-left">
                            <h1 className="score">{seller.score}</h1>
                            <div className="title">综合评分</div>
                            <div className="rank">高于周边商家{seller.rankRate}%</div>
                        </div>
                        <div className="overview-right">
                            <div className="score-wrapper">
                                <span className="title">服务态度</span>
                                <Star size="36" score={seller.serviceScore}></Star>
                                <div className="score">{seller.serviceScore}</div>
                            </div>
                            <div className="score-wrapper">
                                <span className="title">商品评分</span>
                                <Star size="36" score={seller.foodScore}></Star>
                                <div className="score">{seller.foodScore}</div>
                            </div>
                            <div className="delivery-wrapper">
                                <span className="title">送达时间</span>
                                <span className="delivery">{seller.deliveryTime}分钟</span>
                            </div>
                        </div>
                    </div>
                    <Split></Split>
                    <RatingSelect></RatingSelect>
                    <div className="rating-wrapper">
                        <ul>
                            {
                                ratings.map((rating, index) => {
                                    return(
                                        <li className={`rating-item${this.needShow(rating.rateType,rating.text)}`} key={index}>
                                            <div className="avatar">
                                                <img width="28" height="28" src={rating.avatar} alt=""/>
                                            </div>
                                            <div className="content">
                                                <h1 className="name">{rating.username}</h1>
                                                <div className="star-wrapper">
                                                    <Star size="24" score={rating.score}></Star>
                                                    <span className="delivery">{/*{rating.deliveryTime}*/}</span>
                                                </div>
                                                <p className="text">{rating.text}</p>
                                                <div className="recommend">
                                                    <span className={`${(rating.rateType===0)?'icon-thumb_up':''}${(rating.rateType===1)?'icon-thumb_down':''}`}></span>
                                                    {rating.recommend.map((item, index)=>{
                                                        return(
                                                            <span className="item" key={index}>{item}</span>
                                                        )
                                                    })}
                                                </div>
                                                <div className="time">{formatDate(rating.rateTime,'yyyy-MM-dd hh:mm')}</div>
                                            </div>
                                        </li>
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

function mapStateToProps(state){
    return {
        datas: state.good.datas,
        onlyContent: state.good.onlyContent,
        selectType: state.good.selectType
    }
}

export default connect(mapStateToProps)(Ratings);