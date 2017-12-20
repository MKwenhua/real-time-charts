import React from 'react';

const timeUnit = (d, index, setIndex, timeSet) => {
   let time = d.getHours() + ':' + ('0' + (d.getMinutes() + index)).slice(-2);
   let displayClass = index === setIndex ? 'active-t' : '';
   return (
      <li key={'tm_' + index} onClick={timeSet(index)} className={displayClass}>
         <span>{time}</span>
         <span className='ft-rt'>{`${index} min`}</span>
      </li>
   )
}

export default class TimeIntervals extends React.PureComponent {
   render() {
      const {timeSet, ind, date} = this.props;
      const timeList = [];
      for(let i = 1; i < 11; i++) {
         timeList.push(timeUnit(date, i, ind, timeSet));
      }
      return (
         <ul className='time-pick'>
            {timeList}
         </ul>
      )
   }
};
