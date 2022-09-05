import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions } from "../../redux/root.js";
const { send_logout } = actions;

class Logout extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.send_logout();
  }

  render() {
    return <div></div>;
  }
}

function mapDispatchToProps(dispatch) {
  return {
    send_logout: bindActionCreators(send_logout, dispatch),
  };
}

export default connect(null, mapDispatchToProps)(Logout);
