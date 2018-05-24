import React, { Component } from 'react';
import './index.styl';

class RatingSelect extends Component{
    constructor(props){
        super(props);
        this.desc = {
            all: '全部',
            positive: '满意',
            negative: '不满意'
        }
        this.all = 2;
        this.positive = 0;
        this.negative = 1;
    }

    componentWillMount () {
        this.getPositives();
        this.getNegatives();
    }

    getPositives = () => {
        this.positives = this.props.ratings.filter((rating)=>{
            return rating.rateType === this.positive;
        })
    }
    
    getNegatives = () => {
        this.negatives = this.props.ratings.filter((rating)=>{
            return rating.rateType === this.negative;
        })
    }

    select = (type, ev) => {
        // if (!ev._constructed) {
        //     return;
        // }
        typeof this.props.select === 'function' && this.props.select(type);
    }

    toggleContent = (ev) => {
        // if (!ev._constructed) {
        //     return;
        // }
        typeof this.props.toggle === 'function' && this.props.toggle();
    }

    render(){

        let ratings = this.props.ratings;
        
        return(
            <div className="ratingselect">
                <div className="rating-type border-1px">
                    <span onClick={(ev) => {this.select(2, ev)}} className={`block positive${this.props.selectType===2?' active':''}`}>{this.desc.all}<span className="count">{ratings.length}</span></span>
                    <span onClick={(ev) => {this.select(0, ev)}} className={`block positive${this.props.selectType===0?' active':''}`}>{this.desc.positive}<span className="count">{this.positives.length}</span></span>
                    <span onClick={(ev) => {this.select(1, ev)}} className={`block negative${this.props.selectType===1?' active':''}`}>{this.desc.negative}<span className="count">{this.negatives.length}</span></span>
                </div>
                <div className={`switch${this.props.onlyContent?' on':''}`} onClick={(ev) => {this.toggleContent(ev)}}>
                    <span className="icon-check_circle"></span>
                    <span className="text">只看有内容的评价</span>
                </div>
            </div>
        )
    }
}

export default RatingSelect;