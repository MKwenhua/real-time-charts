import React from "react";
import ActiveSpreads from "./options/activespreads";
import {connect} from "react-redux";

@connect((store) => {
  return {user: store.user.user, userFetched: store.user.fetched, tweets: store.tweets.tweets};
})

export default class OptionsView extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  optView = (type) => {
    this.props.itmView(type);
  }
  render() {
    const optsActive = this.props.optsActive;
    return (
      <section id="optionsView" className={this.props.onStart ? "hide-elm" : "ok"}>
        <div className={optsActive === "spreads" ? "in-view-opts" : "hide-elm"}>
          <ActiveSpreads setSpreadRef={this.setSpreadRef.bind(this)} callCT={this.props.spreadCTX} dataSource={this.props.dbSource}/>
        </div>
        <div className={optsActive === "view order" ? "in-view-opts" : "hide-elm"}></div>
      </section>
    )
  }
};
