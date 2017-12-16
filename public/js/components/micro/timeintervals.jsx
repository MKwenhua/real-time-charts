import React from "react";

const timeUnit = (d, index, setIndex, timeSet) => {
   let time = d.getHours() + ':' + ('0' + (d.getMinutes() + index)).slice(-2);
   let displayClass = index === setIndex ? "active-t" : "";
   return (
      <li key={'tm_' + index} onClick={() => timeSet(index)} className={displayClass}>
         <span>{time}</span>
         <span className="ft-rt">{`${index} min`}</span>
      </li>
   )
}

export default class TimeIntervals extends React.PureComponent {

   render() {
      let {timeSet, ind} = this.props;
      const d = new Date();
      let i = 1;
      let timeLi = [];
      while (i < 11) {
         timeLi.push(timeUnit(d, i, ind, timeSet));
         i++;
      }
      return (
         <ul className="time-pick">
            {timeLi}
         </ul>
      )
   }
};
