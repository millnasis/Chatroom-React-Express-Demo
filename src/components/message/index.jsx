import React from "react";
import { Avatar, Badge, Button, Card, List, Tabs } from "antd";
import "./index.scss";
import { connect } from "react-redux";
import { actions } from "../../redux/message.js";
import { bindActionCreators } from "redux";
import moment from "moment";
import {
  totalGrouprMsg,
  totalResult,
  totalUserMsg,
} from "../../../constant/index.js";
import { momentFormat } from "../../../constant";
const { confirm_msg } = actions;

class Message extends React.Component {
  constructor(props) {
    super(props);
  }

  handleMSG = (item) => {
    const { result, from, to, messageType, read, date, room } = item;
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
      } else if (messageType === totalGrouprMsg.INVITE_GROUP) {
        title = `${from.username}已经同意加入群聊${room.room_name}`;
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
      } else if(messageType === totalGrouprMsg.JOIN_GROUP){
        title = `${from.username}已经同意了您加入群聊${room.room_name}的请求`
        if (!read) {
          action.push(
            <Button
              onClick={() =>
                this.props.confirm_msg(
                  totalResult.CONFIRM_BACK,
                  from.username,
                  to,
                  messageType,
                  room.room_id
                )
              }
            >
              好的
            </Button>
          );
        }
      }
    } else if (result === totalResult.DENY_BACK) {
      if (messageType === totalUserMsg.ADD_FRIEND) {
        title = `${from.username}拒绝了您的好友请求`;
        if (!read) {
          action.push(
            <Button
              onClick={() =>
                this.props.confirm_msg(
                  totalResult.DENY_BACK,
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
      } else if (messageType === totalGrouprMsg.INVITE_GROUP) {
        title = `${from.username}拒绝加入群聊${room.room_name}`;
        if (!read) {
          action.push(
            <Button
              onClick={() =>
                this.props.confirm_msg(
                  totalResult.DENY_BACK,
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
      } else if(messageType === totalGrouprMsg.JOIN_GROUP){
        title = `${from.username}拒绝了您加入群聊${room.room_name}的请求`
        if (!read) {
          action.push(
            <Button
              onClick={() =>
                this.props.confirm_msg(
                  totalResult.DENY_BACK,
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
      } else if (messageType === totalGrouprMsg.INVITE_GROUP) {
        title = `${from.username}邀请您加入群聊${room.room_name}`;
        if (!read) {
          action = [
            <Button
              type="primary"
              onClick={() =>
                this.props.confirm_msg(
                  totalResult.CONFIRM,
                  from.username,
                  to,
                  messageType,
                  room.room_id
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
                  messageType,
                  room.room_id
                )
              }
            >
              拒绝
            </Button>,
          ];
        }
      } else if (messageType === totalGrouprMsg.JOIN_GROUP) {
        title = `${from.username}申请加入您的群聊${room.room_name}`;
        if (!read) {
          action = [
            <Button
              type="primary"
              onClick={() =>
                this.props.confirm_msg(
                  totalResult.CONFIRM,
                  from.username,
                  to,
                  messageType,
                  room.room_id
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
                  messageType,
                  room.room_id
                )
              }
            >
              拒绝
            </Button>,
          ];
        }
      }
    }
    if (item.private) {
      description = `${from.sex} ${from.area.join("")} ${moment(
        new Date(date)
      ).format(momentFormat.toSec)}`;
    } else {
      description = `${moment(new Date(date)).format(momentFormat.toSec)}`;
    }

    return { title, action, description };
  };

  render() {
    const { showGroupMSG, showUserMSG } = this.props;
    let groupMSGCount = 0,
      userMSGCount = 0;
    showGroupMSG.forEach((e) => {
      if (!e.read) {
        groupMSGCount++;
      }
    });
    showUserMSG.forEach((e) => {
      if (!e.read) {
        userMSGCount++;
      }
    });
    return (
      <div className="component message">
        <div className="msg-body">
          <Card title="验证消息" headStyle={{ fontSize: "5vmin" }}>
            <Tabs type="card" size="large">
              <Tabs.TabPane
                tab=<Badge count={userMSGCount} offset={[5, -7]} size={"small"}>
                  好友验证
                </Badge>
                key="好友验证"
              >
                <List
                  bordered
                  dataSource={showUserMSG}
                  renderItem={(item) => {
                    const { title, action, description } = this.handleMSG(item);
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
              <Tabs.TabPane
                tab=<Badge
                  count={groupMSGCount}
                  offset={[5, -7]}
                  size={"small"}
                >
                  群系统消息
                </Badge>
                key="群系统消息"
              >
                <List
                  bordered
                  dataSource={showGroupMSG}
                  renderItem={(item) => {
                    const { title, action, description } = this.handleMSG(item);
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
