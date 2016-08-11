const React = require('react');
const makeGraph = require('../../canvas/ctxgraphs.js');

export default class MiniGraph extends React.Component {
   constructor(props) {
      super(props);


   };

   componentDidMount() {
      let stuff = makeGraph(this.props.ctxId, this.props.data, "stuff")
      stuff.renderChart()
   }
   componentWillMount() {

   }
   componentWillUnmount() {

   }
   render() {

      return (<div id={this.props.ctxId} className="holds-graph donut-graph"></div>)

   }
};