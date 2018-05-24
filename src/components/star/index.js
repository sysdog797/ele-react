import React, { Component } from 'react';
import './index.styl';

class Star extends Component{
    constructor(props){
        super(props);
        this.state = {
            itemClasses: []
        }
    }

    componentDidMount(){
        const itemClasses = this.calculateItem();
        this.setState({
            itemClasses: itemClasses
        })
    }

    calculateItem(){
        const LENGTH = 5;
        const CLS_ON = 'on';
        const CLS_HALF = 'half';
        const CLS_OFF = 'off';

        let result = [];
        let score = Math.floor(this.props.score * 2) / 2;
        let hasDecimal = score % 1 !== 0;
        let integer = Math.floor(score);
        for (let i = 0; i < integer; i++) {
          result.push(CLS_ON);
        }
        if (hasDecimal) {
          result.push(CLS_HALF);
        }
        while (result.length < LENGTH) {
          result.push(CLS_OFF);
        }
        return result;
    }

    render(){
        return(
            <div className={`star star-${this.props.size}`}>
                {this.state.itemClasses.map((itemClass,index) =>
                    <span className={`star-item ${itemClass}`} key={index}></span>
                )}
                <span className="star-item" ></span>
            </div>
        )
    }
}

export default Star;