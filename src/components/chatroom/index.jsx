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

const friends = ["奶奶滴", "你奶奶滴"];

const tabItems = ["好友", "群聊"];

const fakeFriend = ["millnasis", "kkk"];

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
    return (
      <div className="talk-room component">
        <div className="list">
          <Tabs centered>
            {tabItems.map((v, i) => {
              return (
                <TabPane tab={v} key={v}>
                  <Collapse>
                    {friends.map((v) => {
                      return (
                        <Panel header={v} key={v}>
                          <List
                            dataSource={fakeFriend}
                            renderItem={(item) => {
                              return (
                                <List.Item className="friend">
                                  <List.Item.Meta
                                    avatar={<Avatar></Avatar>}
                                    title={item}
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
              );
            })}
          </Tabs>
        </div>
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
                <strong>用户名</strong>
              </h2>
              <Divider></Divider>
              <ul className="user-info">
                <li>
                  <label>性别：</label>男
                </li>
                <li>
                  <label>生日：</label>2022年8月31日
                </li>
                <li>
                  <label>所在城市：</label>中国 广西 南宁
                </li>
                <li>
                  <label>个性签名：</label>
                  我是嫩爹我是嫩爹我是嫩爹我是嫩爹我是嫩爹我是嫩爹我是嫩爹我是嫩爹我是嫩爹我是嫩爹我是嫩爹我是嫩爹我是嫩爹我是嫩爹我是嫩爹我是嫩爹我是嫩爹我是嫩爹我是嫩爹我是嫩爹
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ChatRoom;
