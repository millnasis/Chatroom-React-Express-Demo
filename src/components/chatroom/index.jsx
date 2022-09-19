import React from "react";
import {
  Collapse,
  Tabs,
  List,
  Avatar,
  Card,
  Comment,
  Tooltip,
  Image,
  Input,
  Divider,
  Modal,
  Form,
  Button,
  Badge,
} from "antd";
import moment from "moment";
import "./index.scss";
import EditorWarp from "./EditorWarp.jsx";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions } from "../../redux/chatroom.js";
import { withUseNavigateHooksHOC } from "../../tools/withUseNavigateHooksHOC.jsx";
const {
  get_group,
  close_window,
  open_window,
  get_record,
  register_menu_item,
  change_sort,
} = actions;
import {
  ContextMenuTrigger,
  ContextMenu,
  ContextMenuItem,
  Submenu,
} from "rctx-contextmenu";
import { momentFormat } from "../../../constant";

const { Panel } = Collapse;
const { TabPane } = Tabs;

class ChatRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      html: "",
      target: null,
      createSortModal: false,
      sortNameInput: "",
    };
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.talkWindow !== this.props.talkWindow ||
      prevProps.friendArray !== this.props.friendArray ||
      prevProps.groupArray !== this.props.groupArray
    ) {
      const { friendArray, groupArray, talkWindow } = this.props;
      let target = null;
      if (talkWindow.show) {
        const findArr = [];
        let obj;
        if (talkWindow.private) {
          obj = friendArray.find((v) => v.sort_name === talkWindow.target.sort);
        } else {
          obj = groupArray.find((v) => v.sort_name === talkWindow.target.sort);
        }
        if (Array.isArray(obj.arr)) {
          obj.arr.forEach((e) => {
            findArr.push(e);
          });
        }
        target = findArr.find(
          (value) => value.room_id === talkWindow.target.room_id
        );
        // if (target.showMSG.length === 0) {
        //   this.props.get_record(
        //     talkWindow.private,
        //     talkWindow.target.sort,
        //     talkWindow.target.room_id,
        //     3,
        //     target.showMSG.length
        //   );
        // }
        this.setState({ target });
      } else {
        this.setState({ target: null });
      }
    }
  }

  emitmessage = () => {
    this.state.target.socket.emit("message", {
      username: this.props.global.userInfo.username,
      time: new Date(),
      content: this.state.html,
    });
  };

  render() {
    const { friendArray, groupArray, talkWindow } = this.props;
    let friendCount = 0,
      groupCount = 0;
    let contextMenuList = [];
    friendArray.forEach((sort, i) => {
      let count = friendArray[i].arr.reduce((pre, cur) => pre + cur.count, 0);
      friendCount += count;
      friendArray[i].count = count;
      contextMenuList = contextMenuList.concat(sort.arr);
    });
    groupArray.forEach((sort, i) => {
      let count = groupArray[i].arr.reduce((pre, cur) => pre + cur.count, 0);
      groupCount += count;
      groupArray[i].count = count;
      contextMenuList = contextMenuList.concat(sort.arr);
    });
    console.log(friendArray, groupArray);
    return (
      <div className="talk-room component">
        <Modal
          visible={this.state.createSortModal}
          onCancel={() => this.setState({ createSortModal: false })}
          onOk={() => {
            console.log(this.state.sortNameInput, this.state.createSortModal);
            this.props.change_sort(
              this.state.createSortModal.group_id,
              this.state.sortNameInput
            );
            this.setState({ createSortModal: false, sortNameInput: "" });
          }}
        >
          <Form>
            <Form.Item>
              <h2>创建新分组</h2>
            </Form.Item>
            <Form.Item>
              <Input
                onChange={(e) =>
                  this.setState({ sortNameInput: e.nativeEvent.target.value })
                }
              ></Input>
            </Form.Item>
          </Form>
        </Modal>
        {contextMenuList.map((v) => {
          return (
            <ContextMenu id={v.room_id} key={v.room_id}>
              <Submenu title="移动联系人至">
                {v.private
                  ? friendArray
                      .filter((e) => e.sort_name !== v.sort)
                      .map((e1) => {
                        return (
                          <ContextMenuItem
                            key={e1.sort_name}
                            onClick={() =>
                              this.props.change_sort(v.group_id, e1.sort_name)
                            }
                          >
                            {e1.sort_name}
                          </ContextMenuItem>
                        );
                      })
                  : groupArray
                      .filter((e) => e.sort_name !== v.sort)
                      .map((e1) => {
                        return (
                          <ContextMenuItem
                            key={e1.sort_name}
                            onClick={() =>
                              this.props.change_sort(v.group_id, e1.sort_name)
                            }
                          >
                            {e1.sort_name}
                          </ContextMenuItem>
                        );
                      })}
                <ContextMenuItem
                  onClick={() => this.setState({ createSortModal: v })}
                >
                  新建分组
                </ContextMenuItem>
              </Submenu>
            </ContextMenu>
          );
        })}
        <div className="list">
          <Tabs centered>
            <TabPane
              tab={
                <Badge count={friendCount} offset={[10, -5]}>
                  好友
                </Badge>
              }
              key="好友"
            >
              <Collapse>
                {friendArray.map((v) => {
                  return (
                    <Panel
                      header={
                        <Badge count={v.count} offset={[5, 0]}>
                          {v.sort_name}
                        </Badge>
                      }
                      key={v.sort_name}
                    >
                      <List
                        dataSource={v.arr}
                        renderItem={(item) => {
                          return (
                            <ContextMenuTrigger
                              id={item.room_id}
                              key={item.room_id}
                            >
                              <List.Item
                                className="friend"
                                actions={[<Badge count={item.count}></Badge>]}
                                onClick={() => {
                                  this.props.open_window(
                                    true,
                                    item.sort,
                                    item.room_id
                                  );
                                  this.setState({ target: null });
                                }}
                              >
                                <List.Item.Meta
                                  avatar={
                                    <Avatar
                                      src={item.room_name.head_picture}
                                    ></Avatar>
                                  }
                                  title={item.room_name.username}
                                  description={"这里是个性签名"}
                                ></List.Item.Meta>
                              </List.Item>
                            </ContextMenuTrigger>
                          );
                        }}
                      ></List>
                    </Panel>
                  );
                })}
              </Collapse>
            </TabPane>
            <TabPane
              tab={
                <Badge count={groupCount} offset={[10, -5]}>
                  群聊
                </Badge>
              }
              key={"群聊"}
            >
              <Collapse>
                {groupArray.map((v) => {
                  return (
                    <Panel
                      header={
                        <Badge count={v.count} offset={[5, 0]}>
                          {v.sort_name}
                        </Badge>
                      }
                      key={v.sort_name}
                    >
                      <List
                        dataSource={v.arr}
                        renderItem={(item) => {
                          return (
                            <ContextMenuTrigger
                              id={item.room_id}
                              key={item.room_id}
                            >
                              <List.Item
                                className="friend"
                                actions={[<Badge count={item.count}></Badge>]}
                                onClick={() => {
                                  this.props.open_window(
                                    false,
                                    item.sort,
                                    item.room_id
                                  );
                                  this.setState({ target: null });
                                }}
                              >
                                <List.Item.Meta
                                  avatar={
                                    <Avatar src={item.head_picture}></Avatar>
                                  }
                                  title={item.room_name}
                                  description={`共${item.member.length}名群员`}
                                ></List.Item.Meta>
                              </List.Item>
                            </ContextMenuTrigger>
                          );
                        }}
                      ></List>
                    </Panel>
                  );
                })}
              </Collapse>
            </TabPane>
          </Tabs>
        </div>
        {talkWindow.show && this.state.target && (
          <div className="talk-window">
            <div className="talk-area">
              <div className="show">
                <Card
                  title={this.state.target.room_name.username}
                  className="show-card"
                  headStyle={{ textAlign: "center" }}
                  bodyStyle={{
                    position: "relative",
                    height: "100%",
                  }}
                >
                  <div
                    className="loading-history"
                    onClick={() => {
                      if (
                        this.state.target.showMSG.length > 0 &&
                        this.state.target.showMSG[0].sys
                      ) {
                        return;
                      }
                      this.props.get_record(
                        talkWindow.private,
                        talkWindow.target.sort,
                        talkWindow.target.room_id,
                        3,
                        this.state.target.showMSG.length
                      );
                    }}
                  >
                    加载聊天记录
                  </div>
                  <div className="content-warp">
                    <List
                      className="comment-list"
                      itemLayout="horizontal"
                      dataSource={this.state.target.showMSG}
                      renderItem={(item) => {
                        const { time, content, sys } = item;
                        const { head_picture, username } = item.userObj;
                        if (sys) {
                          return (
                            <li>
                              <Comment
                                author={username}
                                content={content}
                              ></Comment>
                            </li>
                          );
                        }
                        return (
                          <li>
                            <Comment
                              author={username}
                              avatar={head_picture}
                              content={
                                <div
                                  dangerouslySetInnerHTML={{ __html: content }}
                                ></div>
                              }
                              datetime={moment(new Date(time)).format(
                                momentFormat.toSec
                              )}
                            />
                          </li>
                        );
                      }}
                    />
                  </div>
                </Card>
              </div>
              <div className="input">
                <EditorWarp
                  key={this.state.target.group_id}
                  close_window={this.props.close_window}
                  target={this.state.target}
                  register_menu_item={this.props.register_menu_item}
                  register={this.props.register}
                  html={this.state.html}
                  emitmessage={this.emitmessage}
                  setHtml={(value) => this.setState({ html: value })}
                ></EditorWarp>
              </div>
            </div>
            <div className="info-area">
              {talkWindow.private ? (
                <div className="info-area-card single">
                  <Image
                    src={this.state.target.room_name.head_picture}
                    width={"50%"}
                    preview={false}
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      this.props.navigate(
                        "/info/" + this.state.target.room_name.username
                      )
                    }
                  ></Image>
                  <h2>
                    <strong
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        this.props.navigate(
                          "/info/" + this.state.target.room_name.username
                        )
                      }
                    >
                      {this.state.target.room_name.username}
                    </strong>
                  </h2>
                  <Divider></Divider>
                  <ul className="user-info-inner">
                    <li>
                      <label>性别：</label>
                      {this.state.target.room_name.sex}
                    </li>
                    <li>
                      <label>生日：</label>
                      {this.state.target.room_name.birthday}
                    </li>
                    <li>
                      <label>所在城市：</label>
                      {this.state.target.room_name.area}
                    </li>
                    <li>
                      <label>个性签名：</label>
                      {this.state.target.room_name.words}
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="info-area-card group">
                  <h3>群资料</h3>
                  <Image
                    src={this.state.target.head_picture}
                    width={"50%"}
                    preview={false}
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      this.props.navigate(`/group/${this.state.target.room_id}`)
                    }
                  ></Image>
                  <h2>
                    <strong
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        this.props.navigate(
                          `/group/${this.state.target.room_id}`
                        )
                      }
                    >
                      {this.state.target.room_name}
                    </strong>
                  </h2>
                  <p className="group-info-words">
                    <strong>群介绍：</strong>
                    {this.state.target.words}
                  </p>
                  <Divider></Divider>
                  <Card className="group-member-list" title={`群成员（${50}）`}>
                    <List
                      dataSource={this.state.target.member}
                      renderItem={(item) => {
                        return (
                          <List.Item
                            className="group-single-member"
                            onClick={() =>
                              this.props.navigate(`/info/${item.username}`)
                            }
                          >
                            <List.Item.Meta
                              avatar={
                                <Avatar
                                  size={"small"}
                                  src={item.head_picture}
                                ></Avatar>
                              }
                              title={item.username}
                            ></List.Item.Meta>
                          </List.Item>
                        );
                      }}
                    ></List>
                  </Card>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    global: state.global,
    ...state.chatroom,
  };
}

function mapDispatch(dispatch) {
  return {
    get_group: bindActionCreators(get_group, dispatch),
    close_window: bindActionCreators(close_window, dispatch),
    open_window: bindActionCreators(open_window, dispatch),
    get_record: bindActionCreators(get_record, dispatch),
    register_menu_item: bindActionCreators(register_menu_item, dispatch),
    change_sort: bindActionCreators(change_sort, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatch
)(withUseNavigateHooksHOC(ChatRoom));
