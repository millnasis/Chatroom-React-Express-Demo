import React from "react";
import { Avatar, Button, Card, List, Tabs } from "antd";
import "./index.scss";
import { connect } from "react-redux";
import { actions } from "../../redux/message.js";
const {} = actions;
class Message extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="component message">
        <div className="msg-body">
          <Card title="验证消息" headStyle={{ fontSize: "5vmin" }}>
            <Tabs type="card" size="large">
              <Tabs.TabPane tab="好友验证" key="好友验证">
                <List
                  bordered
                  dataSource={this.props.showUserMSG}
                  renderItem={(item) => {
                    return (
                      <List.Item
                        actions={[
                          <Button type="primary">同意</Button>,
                          <Button>忽略</Button>,
                        ]}
                      >
                        <List.Item.Meta
                          avatar={
                            <Avatar
                              size={"large"}
                              src={item.from.head_picture}
                            ></Avatar>
                          }
                          title={item.to}
                          description={"item.msg"}
                        ></List.Item.Meta>
                      </List.Item>
                    );
                  }}
                ></List>
              </Tabs.TabPane>
              <Tabs.TabPane tab="群系统消息" key="群系统消息">
                <List
                  bordered
                  dataSource={this.props.showGroupMSG}
                  renderItem={(item) => {
                    return (
                      <List.Item
                        actions={[
                          <Button type="primary">同意</Button>,
                          <Button>忽略</Button>,
                        ]}
                      >
                        <List.Item.Meta
                          avatar={
                            <Avatar
                              size={"large"}
                              src={item.from.head_picture}
                            ></Avatar>
                          }
                          title={item.to}
                          description={"item.msg"}
                        ></List.Item.Meta>
                      </List.Item>
                    );
                  }}
                ></List>
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
    ...state.message,
  };
}

function mapDispatch(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatch)(Message);
