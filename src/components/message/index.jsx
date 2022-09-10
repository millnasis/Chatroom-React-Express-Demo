import React from "react";
import { Avatar, Button, Card, List, Tabs } from "antd";
import "./index.scss";
import { connect } from "react-redux";
import { actions, totalResult } from "../../redux/message.js";
import { totalUserMsg } from "../../redux/info";
import { bindActionCreators } from "redux";
const { confirm_msg } = actions;

class Message extends React.Component {
  constructor(props) {
    super(props);
  }

  handleMSG = (result, from, to, messageType, read) => {
    let title = "",
      action = [],
      description = "";
    if (result === totalResult.CONFIRM_BACK) {
      if (messageType === totalUserMsg.ADD_FRIEND) {
        title = `${from.username}已经同意了您的好友申请`;
        if (!read) {
          action.push(
            <Button
              onClick={() =>
                this.props.confirm_msg(
                  totalResult.CONFIRM_BACK,
                  from.username,
                  to,
                  messageType
                )
              }
            >
              好的
            </Button>
          );
        }
      } else if (messageType === totalUserMsg.DELETE_FRIEND) {
        title = `${from.username}已经将您删除好友`;
        if (!read) {
          action.push(<Button>好的</Button>);
        }
      }
    } else {
      if (messageType === totalUserMsg.ADD_FRIEND) {
        title = `${from.username}申请添加您为好友`;
        if (!read) {
          action = [
            <Button
              type="primary"
              onClick={() =>
                this.props.confirm_msg(
                  totalResult.CONFIRM,
                  from.username,
                  to,
                  messageType
                )
              }
            >
              同意
            </Button>,
            <Button
              onClick={() =>
                this.props.confirm_msg(
                  totalResult.DENY,
                  from.username,
                  to,
                  messageType
                )
              }
            >
              拒绝
            </Button>,
          ];
        }
      }
    }
    description = `${from.sex} ${from.area.join("")}`;
    return { title, action, description };
  };

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
                    const { title, action, description } = this.handleMSG(
                      item.result,
                      item.from,
                      item.to,
                      item.messageType,
                      item.read
                    );
                    return (
                      <List.Item
                        actions={action}
                        className={item.read && "msg-checked"}
                      >
                        <List.Item.Meta
                          avatar={
                            <Avatar
                              size={"large"}
                              src={item.from.head_picture}
                            ></Avatar>
                          }
                          title={title}
                          description={description}
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
  return {
    confirm_msg: bindActionCreators(confirm_msg, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatch)(Message);
