import React from "react";
import { Avatar, Layout, Menu } from "antd";
import { Route, Routes, Link } from "react-router-dom";
import "./app.scss";
import { withUseParamsHooksHOC } from "./tools/withUseNavigateHOC.jsx";
import ChatRoom from "./components/chatroom/index.jsx";
import axios from "axios";
import Message from "./components/message/index.jsx";
import Search from "./components/search/index.jsx";
import Info from "./components/info/index.jsx";
import CreateRoom from "./components/createRoom/index.jsx";

const { Content, Footer, Header } = Layout;

const menuItems = [
  {
    label: "聊天室",
    key: "main",
  },
  {
    label: "通知",
    key: "msg",
  },
  {
    label: "添加好友",
    key: "search",
  },
  {
    label: "个人信息",
    key: "info",
  },
  {
    label: "新建房间",
    key: "create-room",
  },
  {
    label: "退出登陆",
    key: "quit",
  },
];

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    return (
      <Layout>
        <Header>
          <div className="avatar">
            <Avatar src="" shape="square" size={"large"}></Avatar>
            <span className="username">用户名</span>
          </div>
          <Menu
            mode="horizontal"
            theme="dark"
            items={menuItems}
            onClick={(info) => {
              console.log(info);
              this.props.navigate(`/${info.key}`);
            }}
          ></Menu>
        </Header>
        <Content className="main-content">
          <Routes>
            <Route path="/main" element={<ChatRoom></ChatRoom>}></Route>
            <Route path="/msg" element={<Message></Message>}></Route>
            <Route path="/search" element={<Search></Search>}></Route>
            <Route path="/info" element={<Info></Info>}></Route>
            <Route
              path="/create-room"
              element={<CreateRoom></CreateRoom>}
            ></Route>
          </Routes>
        </Content>
        <Footer></Footer>
      </Layout>
    );
  }
}

export default withUseParamsHooksHOC(App);
