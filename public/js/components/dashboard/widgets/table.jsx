import React from 'react';

export default class Table extends React.PureComponent {
  render() {
    return (
      <table className='table table-striped  table-md table-inverse'>
        <thead>
          <tr>
            <th>
              <i className='fa fa-codepen' aria-hidden='true'></i>
            </th>
            <th>
              Column heading
            </th>
            <th>
              Column heading
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className='active'>
            <th className='row-scope'>1</th>
            <td>
              Column content
            </td>
            <td>
              Column content
            </td>
            <td>
              Column content
            </td>
          </tr>
          <tr>
            <th className='row-scope'>2</th>
            <td>
              Column content
            </td>
            <td>
              Column content
            </td>
            <td>
              Column content
            </td>
          </tr>
          <tr className='success'>
            <th className='row-scope'>3</th>
            <td>
              Column content
            </td>
            <td>
              Column content
            </td>
            <td>
              Column content
            </td>
          </tr>
          <tr>
            <th className='row-scope'>4</th>
            <td>
              Column content
            </td>
            <td>
              Column content
            </td>
            <td>
              Column content
            </td>
          </tr>
          <tr className='warning'>
            <th className='row-scope'>5</th>
            <td>
              Column content
            </td>
            <td>
              Column content
            </td>
            <td>
              Column content
            </td>
          </tr>
          <tr>
            <th className='row-scope'>6</th>
            <td>
              Column content
            </td>
            <td>
              Column content
            </td>
            <td>
              Column content
            </td>
          </tr>
          <tr className='danger'>
            <th className='row-scope'>7</th>
            <td>
              Column content
            </td>
            <td>
              Column content
            </td>
            <td>
              Column content
            </td>
          </tr>
        </tbody>
      </table>

    );
  }
};
