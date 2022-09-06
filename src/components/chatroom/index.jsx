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
const { get_group, close_window, open_window } = actions;

const { Panel } = Collapse;
const { TabPane } = Tabs;

class ChatRoom extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [
        {
          author: "Han Solo",
          avatar: "https://joeschmoe.io/api/v1/random",
          content: (
            <p>
              We supply a series of design principles, practical patterns and
              high quality design resources (Sketch and Axure), to help people
              create their product prototypes beautifully and efficiently.
            </p>
          ),
          datetime: <span>{moment().subtract(1, "days").fromNow()}</span>,
        },
        {
          author: "Han Solo",
          avatar: "https://joeschmoe.io/api/v1/random",
          content: (
            <p>
              We supply a series of design principles, practical patterns and
              high quality design resources (Sketch and Axure), to help people
              create their product prototypes beautifully and efficiently.
            </p>
          ),
          datetime: <span>{moment().subtract(2, "days").fromNow()}</span>,
        },
      ],
    };
  }

  render() {
    console.log(this.props);
    const { friendArray, groupArray, talkWindow } = this.props;
    const { target } = talkWindow;
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
                                this.props.open_window(true, item.room_id);
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
                                this.props.open_window(false, item.room_id);
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
                    onClick={() =>
                      this.setState({
                        data: [
                          {
                            author: "Han Solo",
                            avatar: "https://joeschmoe.io/api/v1/random",
                            content: <p>新增的</p>,
                            datetime: (
                              <span>
                                {moment().subtract(2, "days").fromNow()}
                              </span>
                            ),
                          },
                          ...this.state.data,
                        ],
                      })
                    }
                  >
                    加载聊天记录
                  </div>
                  <div className="content-warp">
                    <List
                      className="comment-list"
                      itemLayout="horizontal"
                      dataSource={this.state.data}
                      renderItem={(item) => (
                        <li>
                          <Comment
                            actions={item.actions}
                            author={item.author}
                            avatar={item.avatar}
                            content={item.content}
                            datetime={item.datetime}
                          />
                        </li>
                      )}
                    />
                  </div>
                </Card>
              </div>
              <div className="input">
                <EditorWarp></EditorWarp>
              </div>
            </div>
            <div className="info-area">
              <div className="info-area-card single">
                <Image
                  src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fi.qqkou.com%2Fi%2F1a4183908974x4246091424b26.jpg&refer=http%3A%2F%2Fi.qqkou.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1664507166&t=ae22e13986af45fa0f12d13d1da733b7"
                  width={"50%"}
                ></Image>

                <h2>
                  <strong>{target.room_name}</strong>
                </h2>
                <Divider></Divider>
                <ul className="user-info-inner">
                  <li>
                    <label>性别：</label>
                    {target.sex}
                  </li>
                  <li>
                    <label>生日：</label>
                    {target.birthday}
                  </li>
                  <li>
                    <label>所在城市：</label>
                    {target.area}
                  </li>
                  <li>
                    <label>个性签名：</label>
                    {target.words}
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
  };
}

export default connect(mapStateToProps, mapDispatch)(ChatRoom);
