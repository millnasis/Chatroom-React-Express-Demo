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
  Divider,
} from "antd";
import moment from "moment";
import "./index.scss";
import EditorWarp from "./EditorWarp.jsx";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions } from "../../redux/chatroom.js";
const { get_group, close_window, open_window, get_record, register_menu_item } =
  actions;

const { Panel } = Collapse;
const { TabPane } = Tabs;

class ChatRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      html: "",
    };
  }

  render() {
    console.log(this.props);
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
      if (target.showMSG.length === 0) {
        this.props.get_record(
          talkWindow.private,
          talkWindow.target.sort,
          talkWindow.target.room_id
        );
      }
    }
    return (
      <div className="talk-room component">
        <div className="list">
          <Tabs centered>
            <TabPane tab="好友" key="好友">
              <Collapse>
                {friendArray.map((v) => {
                  return (
                    <Panel header={v.sort_name} key={v.sort_name}>
                      <List
                        dataSource={v.arr}
                        renderItem={(item) => {
                          return (
                            <List.Item
                              className="friend"
                              onClick={() => {
                                this.props.open_window(
                                  true,
                                  item.sort,
                                  item.room_id
                                );
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
                          );
                        }}
                      ></List>
                    </Panel>
                  );
                })}
              </Collapse>
            </TabPane>
            <TabPane tab="群聊" key={"群聊"}>
              <Collapse>
                {groupArray.map((v) => {
                  return (
                    <Panel header={v.sort_name} key={v.sort_name}>
                      <List
                        dataSource={v.arr}
                        renderItem={(item) => {
                          return (
                            <List.Item
                              className="friend"
                              onClick={() => {
                                this.props.open_window(
                                  false,
                                  item.sort,
                                  item.room_id
                                );
                              }}
                            >
                              <List.Item.Meta
                                avatar={<Avatar></Avatar>}
                                title={item.room_name}
                                description={"这里是个性签名"}
                              ></List.Item.Meta>
                            </List.Item>
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
        {talkWindow.show && (
          <div className="talk-window">
            <div className="talk-area">
              <div className="show">
                <Card
                  title="聊天名称"
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
                      if (target.showMSG[0].sys) {
                        return;
                      }
                      this.props.get_record(
                        talkWindow.private,
                        talkWindow.target.sort,
                        talkWindow.target.room_id,
                        3,
                        target.showMSG.length
                      );
                    }}
                  >
                    加载聊天记录
                  </div>
                  <div className="content-warp">
                    <List
                      className="comment-list"
                      itemLayout="horizontal"
                      dataSource={target.showMSG}
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
                              datetime={moment(new Date(time)).fromNow()}
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
                  close_window={this.props.close_window}
                  target={target}
                  userInfo={this.props.global.userInfo}
                  register_menu_item={this.props.register_menu_item}
                  register={this.props.register}
                  html={this.state.html}
                  setHtml={(value) => this.setState({ html: value })}
                ></EditorWarp>
              </div>
            </div>
            <div className="info-area">
              <div className="info-area-card single">
                <Image
                  src={target.room_name.head_picture}
                  width={"50%"}
                ></Image>

                <h2>
                  <strong>{target.room_name.username}</strong>
                </h2>
                <Divider></Divider>
                <ul className="user-info-inner">
                  <li>
                    <label>性别：</label>
                    {target.room_name.sex}
                  </li>
                  <li>
                    <label>生日：</label>
                    {target.room_name.birthday}
                  </li>
                  <li>
                    <label>所在城市：</label>
                    {target.room_name.area}
                  </li>
                  <li>
                    <label>个性签名：</label>
                    {target.room_name.words}
                  </li>
                </ul>
              </div>
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
  };
}

export default connect(mapStateToProps, mapDispatch)(ChatRoom);
