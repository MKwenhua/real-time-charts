const React = require('react');


export default class TimeIntervals extends React.Component {
   constructor(props) {
      super(props);


      this.timeClicked = this.timeClicked.bind(this);

   }
   timeClicked(ind) {

      this.props.timeSet(ind);
   }
   render() {
      const d = new Date();
      var i = 1;
      let timeLi = [];
      while (i < 11) {
         let tm = d.getHours() + ':' + ('0' + (d.getMinutes() + i)).slice(-2);
         let cl = i === this.props.ind ? "active-t" : "";
         timeLi.push(<li key={'tm_' + i} onClick={this.timeClicked.bind(this, i)} className={cl}> 
        <span>{tm}</span><span className="ft-rt">{`${i} min`}</span></li>);
         i++;
      }
      return (<ul className="time-pick">
                  {timeLi}
               </ul>)
   }
};