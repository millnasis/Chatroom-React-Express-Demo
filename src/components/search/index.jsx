import React from "react";
import { Avatar, Button, Card, Divider, Input, Tabs } from "antd";
import "./index.scss";
import { actions } from "../../redux/search.js";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withUseNavigateHooksHOC } from "../../tools/withUseNavigateHooksHOC.jsx";
const { get_group_search, get_user_search } = actions;

function SingleCard(props) {
  console.log(props);
  return (
    <div
      className="single-card"
      onClick={() => props.navigate("/info/" + props.username)}
    >
      <Avatar src={props.avatar} className="card-avatar"></Avatar>
      <div className="info">
        <div className="username">{props.username}</div>
        <div className="msg">{props.msg}</div>
        <div className="action">
          <Button>+添加</Button>
        </div>
      </div>
    </div>
  );
}

class Search extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="search component">
        <div className="search-body">
          <Card title="搜索" headStyle={{ fontSize: "5vmin" }}>
            <Tabs type="card" size="large">
              <Tabs.TabPane tab="找人" key={"找人"}>
                <div className="search-tab-pane">
                  <Input.Search
                    className="search-bar"
                    enterButton="搜索"
                    placeholder="输入昵称"
                    onSearch={(value) => this.props.get_user_search(value)}
                    size="large"
                  ></Input.Search>
                  <Divider></Divider>
                  <Card>
                    {this.props.showUserSearchArr.map((v, i) => {
                      const { username, head_picture, area, sex } = v;
                      return (
                        <Card.Grid className="search-card-grid" key={username}>
                          <SingleCard
                            avatar={head_picture}
                            msg={`${sex} ${area.join("")}`}
                            username={username}
                            navigate={this.props.navigate}
                          ></SingleCard>
                        </Card.Grid>
                      );
                    })}
                  </Card>
                </div>
              </Tabs.TabPane>
              <Tabs.TabPane tab="找群" key={"找群"}>
                <div className="search-tab-pane">
                  <Input.Search
                    className="search-bar"
                    enterButton="搜索"
                    placeholder="输入群聊名称"
                    onSearch={(value) => this.props.get_group_search(value)}
                    size="large"
                  ></Input.Search>
                  <Divider></Divider>
                  <Card>
                    {this.props.showGroupSearchArr.map((v, i) => {
                      const { head_picture, room_name, room_id, member } = v;
                      return (
                        <Card.Grid className="search-card-grid" key={room_id}>
                          <SingleCard
                            avatar={head_picture}
                            msg={`群聊共${member.length}人`}
                            username={room_name}
                          ></SingleCard>
                        </Card.Grid>
                      );
                    })}
                  </Card>
                </div>
              </Tabs.TabPane>
            </Tabs>
          </Card>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.search,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    get_group_search: bindActionCreators(get_group_search, dispatch),
    get_user_search: bindActionCreators(get_user_search, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withUseNavigateHooksHOC(Search));
