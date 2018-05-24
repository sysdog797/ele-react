import React, { Component } from 'react';
import './cartcontrol.styl';

class Cartcontrol extends Component{
    constructor (props) {
        super(props);
        this.state = {
            count: 0
        }
    }

    componentWillReceiveProps () {
        this.initCart(this.props.selectFoods);
    }

    initCart= (food) => {
        let hasFood = false;
        if(typeof food === 'undefined'){
            return;
        }
        if(food.length===0){
            this.setState({count:0});
            return;
        }
        for(let i=0;i<food.length;i++){
            if(food[i]['name']===this.props.food.name){
                this.setState({count:food[i]['count']});
                hasFood = true;
            }
        }
        if(!hasFood){
            this.setState({count:0});
        }
    }

    addCart = (ev) => {
        ev.stopPropagation();
        if (!this.state.count) {
            this.setState({
                count: 1
            })
        } else {
            this.setState((prevState)=>({
                count: prevState.count + 1
            }))
        }
        typeof this.props.add === 'function' && this.props.add(this.ball,this.props.food.name,this.props.food.price);
    }

    decreaseCart = (ev) => {
        ev.stopPropagation();
        if (this.state.count) {
            this.setState((prevState)=>({
                count: prevState.count - 1
            }))
        }
        typeof this.props.decrease === 'function' && this.props.decrease(this.props.food.name);
    }

    getBall = (ball) => {
        this.ball = ball;
    }

    render(){
        return (
            <div className="cartcontrol">
                <div className={`cart-decrease${this.state.count>0?'':' hide'}`} onClick={(ev)=>{this.decreaseCart(ev)}}>
                    <span className="inner icon-remove_circle_outline"></span>
                </div>
                <div className={`cart-count${this.state.count>0?'':' hide'}`}>{this.state.count}</div>
                <div className="cart-add icon-add_circle" ref={this.getBall} onClick={(ev)=>{this.addCart(ev)}}></div>
            </div>
        )
    }
}

export default Cartcontrol;