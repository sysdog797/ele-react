import React, { Component } from 'react';
import './index.styl';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as goodActions from '../../store/good/actions';

class RatingSelect extends Component{
    constructor(props){
        super(props);
        this.desc = {
            all: '全部',
            positive: '满意',
            negative: '不满意'
        }
        //this.all = 2;
        this.positive = 0;
        this.negative = 1;
    }

    select = (type, ev) => {
        // if (!ev._constructed) {
        //     return;
        // }
        this.props.actions.selectRating(type);
    }

    toggleContent = (ev) => {
        // if (!ev._constructed) {
        //     return;
        // }
        this.props.actions.toggleContent(this.props.onlyContent);
    }

    render(){
   
        const { datas, selectType, selectedFood } = this.props;
        let ratings;
        if(selectedFood){
            ratings = selectedFood.ratings;
        }else{
            ratings = datas.ratings;
        }

        let positive = ratings.filter((rating)=>{
            return rating.rateType === this.positive;
        });

        let negative = ratings.filter((rating)=>{
            return rating.rateType === this.negative;
        });
        
        return(
            <div className="ratingselect">
                <div className="rating-type border-1px">
                    <span onClick={(ev) => {this.select(2, ev)}} className={`block positive${selectType===2?' active':''}`}>{this.desc.all}<span className="count">{ratings.length}</span></span>
                    <span onClick={(ev) => {this.select(0, ev)}} className={`block positive${selectType===0?' active':''}`}>{this.desc.positive}<span className="count">{positive.length}</span></span>
                    <span onClick={(ev) => {this.select(1, ev)}} className={`block negative${selectType===1?' active':''}`}>{this.desc.negative}<span className="count">{negative.length}</span></span>
                </div>
                <div className={`switch${this.props.onlyContent?' on':''}`} onClick={(ev) => {this.toggleContent(ev)}}>
                    <span className="icon-check_circle"></span>
                    <span className="text">只看有内容的评价</span>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        datas: state.good.datas,
        selectType: state.good.selectType,
        onlyContent: state.good.onlyContent,
        selectedFood: state.good.selectedFood
    }
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        ...ownProps,
        actions: bindActionCreators({...goodActions}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RatingSelect);