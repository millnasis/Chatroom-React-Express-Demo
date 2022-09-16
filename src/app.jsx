import React from "react";
import { Avatar, Badge, Layout, Menu, notification } from "antd";
import { Route, Routes, Link } from "react-router-dom";
import "./app.scss";
import ChatRoom from "./components/chatroom/index.jsx";
import Message from "./components/message/index.jsx";
import Search from "./components/search/index.jsx";
import Info from "./components/info/index.jsx";
import CreateRoom from "./components/createRoom/index.jsx";
import { withUseNavigateHooksHOC } from "./tools/withUseNavigateHooksHOC.jsx";
import { withUseLocationHooksHOC } from "./tools/withUseLocationHooksHOC.jsx";
import LoginPage from "./components/loginPage/index.jsx";
import { connect } from "react-redux";
import { actions } from "./redux/root";
import { bindActionCreators } from "redux";
import Logout from "./components/logout/index.jsx";
import GroupInfo from "./components/groupInfo/index.jsx";

const { get_user_info, clear_notification } = actions;

const { Content, Footer, Header } = Layout;

const loginItem = [
  {
    label: "请在登录后使用其他功能 ^_^",
    key: "login",
  },
];

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.get_user_info(this.props.chatroom.initial, undefined);
  }

  componentDidUpdate(prevProps) {
    // console.log(this.props.login, this.props.userInfo);
    if (
      prevProps.location.pathname !== this.props.location.pathname ||
      this.props.login !== prevProps.login
    ) {
      this.props.get_user_info(this.props.chatroom.initial, this.props.socket);
      if (this.props.location.pathname !== "/login" && !this.props.login) {
        this.props.navigate("/login");
      } else if (
        this.props.location.pathname === "/login" &&
        this.props.login
      ) {
        this.props.navigate("/");
      }
    }
    if (
      prevProps.notification.state !== this.props.notification.state &&
      this.props.notification.state !== -1
    ) {
      switch (this.props.notification.state) {
        case 0:
          notification.success({
            message: this.props.notification.content,
          });
          break;

        case 1:
          notification.error({
            message: this.props.notification.content,
          });
          break;
        case 2:
          notification.warning({
            message: this.props.notification.content,
          });
          break;

        default:
          break;
      }
      this.props.clear_notification();
    }
  }

  render() {
    let { head_picture, username, message } = this.props.userInfo;
    if (!Array.isArray(message)) {
      message = [];
    }
    let count = 0;
    message.forEach((e) => {
      if (!e.read) {
        count++;
      }
    });
    const menuItems = [
      {
        label: "聊天室",
        key: "main",
      },
      {
        label: (
          <Badge count={count} offset={[8, -7]}>
            <span style={{ color: "white" }}>通知</span>
          </Badge>
        ),
        key: "msg",
      },
      {
        label: "添加好友",
        key: "search",
      },
      {
        label: "新建房间",
        key: "create-room",
      },
      {
        label: "退出登陆",
        key: "logout",
      },
    ];
    return (
      <Layout>
        <Header>
          {this.props.login && (
            <div
              className="avatar"
              onClick={() => this.props.navigate("/info/" + username)}
            >
              <Avatar src={head_picture} shape="square" size={"large"}></Avatar>
              <span className="username">{username}</span>
            </div>
          )}
          <Menu
            mode="horizontal"
            theme="dark"
            items={this.props.login ? menuItems : loginItem}
            onClick={(info) => {
              this.props.navigate(`/${info.key}`);
            }}
          ></Menu>
        </Header>
        <Content className="main-content">
          <Routes>
            <Route path="/main" element={<ChatRoom></ChatRoom>}></Route>
            <Route path="/msg" element={<Message></Message>}></Route>
            <Route path="/search" element={<Search></Search>}></Route>
            <Route path="/info/:username" element={<Info></Info>}></Route>
            <Route path="/login" element={<LoginPage></LoginPage>}></Route>
            <Route path="/logout" element={<Logout></Logout>}></Route>
            <Route
              path="/group/:groupid"
              element={<GroupInfo></GroupInfo>}
            ></Route>
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

function mapStateToProps(state) {
  return {
    ...state.global,
    chatroom: state.chatroom,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    get_user_info: bindActionCreators(get_user_info, dispatch),
    clear_notification: bindActionCreators(clear_notification, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withUseNavigateHooksHOC(withUseLocationHooksHOC(App)));
