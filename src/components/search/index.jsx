import React from "react";
import { Avatar, Button, Card, Divider, Input, Tabs, Typography } from "antd";
import "./index.scss";

const friendData = [
  {
    avatar:
      "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201901%2F19%2F20190119105005_uJPTs.thumb.700_0.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1664594908&t=5adcfce282483b7668306e536669a565",
    username: "kkk",
    msg: "我是嫩爹",
  },
  {
    avatar:
      "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201901%2F19%2F20190119105005_uJPTs.thumb.700_0.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1664594908&t=5adcfce282483b7668306e536669a565",
    username: "kkk",
    msg: "我是嫩爹",
  },
  {
    avatar:
      "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201901%2F19%2F20190119105005_uJPTs.thumb.700_0.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1664594908&t=5adcfce282483b7668306e536669a565",
    username: "kkk",
    msg: "我是嫩爹",
  },
  {
    avatar:
      "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201901%2F19%2F20190119105005_uJPTs.thumb.700_0.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1664594908&t=5adcfce282483b7668306e536669a565",
    username: "kkk",
    msg: "我是嫩爹",
  },
];

function SingleCard(props) {
  return (
    <div className="single-card">
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
                    size="large"
                  ></Input.Search>
                  <Divider></Divider>
                  <Card>
                    {friendData.map((v, i) => (
                      <Card.Grid className="search-card-grid" key={i}>
                        <SingleCard
                          avatar={v.avatar}
                          msg={v.msg}
                          username={v.username}
                        ></SingleCard>
                      </Card.Grid>
                    ))}
                  </Card>
                </div>
              </Tabs.TabPane>
              <Tabs.TabPane tab="找群" key={"找群"}>
                <div className="search-tab-pane">
                  <Input.Search
                    className="search-bar"
                    enterButton="搜索"
                    placeholder="输入群聊名称"
                    size="large"
                  ></Input.Search>
                  <Divider></Divider>
                  <Card>
                    {friendData.map((v, i) => (
                      <Card.Grid className="search-card-grid" key={i}>
                        <SingleCard
                          avatar={v.avatar}
                          msg={v.msg}
                          username={v.username}
                        ></SingleCard>
                      </Card.Grid>
                    ))}
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

export default Search;
