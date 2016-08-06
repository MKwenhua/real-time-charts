const React = require('react');
//import Datetime from 'react-datetime';


export default class CallPut extends React.Component {


render() {
   const  d = new Date();
     const time =  d.getHours() + ':'+ ('0' + d.getMinutes()).slice(-2);
    return (   <div className="option-buy-sell">
                <p className="text-wrap-values time-ticker"><strong>{time}</strong></p>
                <div className="text-wrap-values plus-minus"><i className="material-icons">remove</i></div><div className="text-wrap-values plus-minus"> <i className="material-icons">add</i></div>
                <p className="profit">
                	71%
                </p>
                
                <div className="trade-butt put-butt">
                <img src="/icons/gain.png" />
                <strong>Put</strong>
                </div>
                <div className="trade-butt  call-butt">
                	<img src="/icons/loss.png" />
                	<strong>Call</strong>
                </div>
              </div>
            )
	}
};