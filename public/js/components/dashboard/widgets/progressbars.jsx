import React from 'react';

export default class ProgressBars extends React.PureComponent {
  width66 = {width: '66%'}
  width45 = {width: '45%'}
  width25 = {width: '25%'}
  width3 = {width: '3%'}
  width1 = { width: '1%'}

  render() {
    return (
      <div className='x_content'>
        <div className='widget_summary'>
          <div className='w_left w_25'>
            <span>0.1.5.2</span>
          </div>
          <div className='w_center w_55'>
            <div className='progress'>
              <div
                className='progress-bar bg-green'
                role='progressbar'
                aria-valuenow='60'
                aria-valuemin='0'
                aria-valuemax='100'
                style={this.width66}>

              </div>
            </div>
          </div>
          <div className='w_right w_20'>
            <span>123k</span>
          </div>
          <div className='clearfix'></div>
        </div>

        <div className='widget_summary'>
          <div className='w_left w_25'>
            <span>0.1.5.3</span>
          </div>
          <div className='w_center w_55'>
            <div className='progress'>
              <div
                className='progress-bar bg-green'
                role='progressbar'
                aria-valuenow='60'
                aria-valuemin='0'
                aria-valuemax='100'
                style={this.width45}>

              </div>
            </div>
          </div>
          <div className='w_right w_20'>
            <span>53k</span>
          </div>
          <div className='clearfix'></div>
        </div>
        <div className='widget_summary'>
          <div className='w_left w_25'>
            <span>0.1.5.4</span>
          </div>
          <div className='w_center w_55'>
            <div className='progress'>
              <div
                className='progress-bar bg-green'
                role='progressbar'
                aria-valuenow='60'
                aria-valuemin='0'
                aria-valuemax='100'
                style={this.width25}>
                <span className='sr-only'>60% Complete</span>
              </div>
            </div>
          </div>
          <div className='w_right w_20'>
            <span>23k</span>
          </div>
          <div className='clearfix'></div>
        </div>
        <div className='widget_summary'>
          <div className='w_left w_25'>
            <span>0.1.5.5</span>
          </div>
          <div className='w_center w_55'>
            <div className='progress'>
              <div
                className='progress-bar bg-green'
                role='progressbar'
                aria-valuenow='60'
                aria-valuemin='0'
                aria-valuemax='100'
                style={this.width3}>
              </div>
            </div>
          </div>
          <div className='w_right w_20'>
            <span>3k</span>
          </div>
          <div className='clearfix'></div>
        </div>
        <div className='widget_summary'>
          <div className='w_left w_25'>
            <span>0.1.5.6</span>
          </div>
          <div className='w_center w_55'>
            <div className='progress'>
              <div className='progress-bar bg-green'
                role='progressbar'
                aria-valuenow='60'
                aria-valuemin='0'
                aria-valuemax='100'
                style={this.width1}>
                </div>
            </div>
          </div>
          <div className='w_right w_20'>
            <span>1k</span>
          </div>
        </div>
      </div>
    );
  }
};
