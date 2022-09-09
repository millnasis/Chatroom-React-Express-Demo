import React from "react";
import { Card, Form, Input, Avatar, Button, Alert } from "antd";
import { connect } from "react-redux";
import "./index.scss";
import { bindActionCreators } from "redux";

import { actions } from "../../redux/login.js";
import { actions as rootActions } from "../../redux/root.js";
const { reset_login_error } = actions;
const { send_login, send_register } = rootActions;

class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isRegister: false,
    };
  }

  submitHandle = (values) => {
    const { username, password } = values;
    if (!this.state.isRegister) {
      this.props.send_login(username, password);
    } else {
      this.props.send_register(username, password);
    }
  };

  render() {
    return (
      <div className="component login-page">
        <div className="login-page-body">
          <Card
            title={
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <Avatar
                  size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                ></Avatar>
                <h3>{this.state.isRegister ? "注册" : "登陆"}</h3>
              </div>
            }
          >
            <Form onFinish={this.submitHandle}>
              <Form.Item
                label="Username"
                name="username"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input
                  onChange={() => {
                    this.props.isLoginError !== null
                      ? this.props.reset_login_error()
                      : null;
                  }}
                />
              </Form.Item>
              <Form.Item>
                {this.props.isLoginError === "username" && (
                  <Alert showIcon message="用户名有误" type="error"></Alert>
                )}
                {this.props.isLoginError === "userexist" && (
                  <Alert showIcon message="用户已存在" type="error"></Alert>
                )}
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password
                  onChange={() => {
                    this.props.isLoginError !== null
                      ? this.props.reset_login_error()
                      : null;
                  }}
                />
              </Form.Item>
              <Form.Item>
                {this.props.isLoginError === "password" && (
                  <Alert showIcon message="密码错误" type="error"></Alert>
                )}
              </Form.Item>

              <Form.Item wrapperCol={{ offset: 20 }}>
                <a
                  onClick={() =>
                    this.setState({ isRegister: !this.state.isRegister })
                  }
                >
                  {this.state.isRegister ? "去登陆？" : "去注册？"}
                </a>
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 15, span: 20 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ marginRight: "8px" }}
                  loading={this.props.isLoginModalFetching}
                >
                  {this.state.isRegister ? "注册" : "登陆"}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.login,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    send_login: bindActionCreators(send_login, dispatch),
    send_register: bindActionCreators(send_register, dispatch),
    reset_login_error: bindActionCreators(reset_login_error, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
