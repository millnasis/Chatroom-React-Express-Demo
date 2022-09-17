import ImgCrop from "antd-img-crop";
import React from "react";
import "./index.scss";
import {
  Form,
  Input,
  Button,
  Card,
  Divider,
  Cascader,
  Upload,
  Image,
  DatePicker,
  Radio,
} from "antd";
import { EditOutlined } from "@ant-design/icons";

import { actions } from "../../redux/info.js";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withUseParamsHooksHOC } from "../../tools/withUseParamsHooksHOC.jsx";
import { LoadingOutlined, PlusOutlined, SkinOutlined } from "@ant-design/icons";
const { get_info, add_friend, delete_friend } = actions;
import moment from "moment";
import { areaOptions, momentFormat } from "../../../constant/index";
import { totalIdentity } from "../../../constant/index.js";

import axios from "axios";

const FormItem = (props) => {
  const { sendToUpdate, username, name, content, identity } = props;
  const sendMethod = async () => {
    try {
      const ret = await sendToUpdate(username, name, value);
      if (!ret) {
        return;
      }
      setEdit(false);
      setRecord(ret);
      setValue(ret);
    } catch (error) {
      console.error(error);
    }
  };
  const [edit, setEdit] = React.useState(false);
  const [value, setValue] = React.useState(content);
  const [record, setRecord] = React.useState(content);
  React.useEffect(() => {
    if (!record) {
      setValue(content);
      setRecord(content);
    }
  });
  switch (props.type) {
    case "city":
      return (
        <Form.Item className="form-item">
          <div className="form-item-inner">
            <div className="label">{props.label}</div>
            <div className="content">
              {identity === totalIdentity.ME ? (
                !edit ? (
                  <>
                    {record}
                    <span
                      className="edit-control"
                      onClick={() => setEdit(true)}
                    >
                      <EditOutlined></EditOutlined>&nbsp;编辑
                    </span>
                  </>
                ) : (
                  <>
                    <Cascader
                      options={areaOptions}
                      value={value}
                      onChange={(value, selectOtion) => {
                        setValue(value);
                      }}
                      placeholder="请选择"
                    />
                    <div className="btn-control">
                      <Button type="primary" onClick={sendMethod}>
                        保存
                      </Button>
                      <Button type="default" onClick={() => setEdit(false)}>
                        取消
                      </Button>
                    </div>
                  </>
                )
              ) : (
                record
              )}
            </div>
          </div>
        </Form.Item>
      );
    case "date":
      return (
        <Form.Item className="form-item">
          <div className="form-item-inner">
            <div className="label">{props.label}</div>
            <div className="content">
              {identity === totalIdentity.ME ? (
                !edit ? (
                  <>
                    {record}
                    <span
                      className="edit-control"
                      onClick={() => setEdit(true)}
                    >
                      <EditOutlined></EditOutlined>&nbsp;编辑
                    </span>
                  </>
                ) : (
                  <>
                    <DatePicker
                      defaultValue={moment(record, momentFormat.toDay)}
                      onChange={(value) => {
                        setValue(value ? value.format(momentFormat.toDay) : "");
                      }}
                    ></DatePicker>
                    <div className="btn-control">
                      <Button type="primary" onClick={sendMethod}>
                        保存
                      </Button>
                      <Button type="default" onClick={() => setEdit(false)}>
                        取消
                      </Button>
                    </div>
                  </>
                )
              ) : (
                record
              )}
            </div>
          </div>
        </Form.Item>
      );
    case "number":
      return (
        <Form.Item className="form-item">
          <div className="form-item-inner">
            <div className="label">{props.label}</div>
            <div className="content">
              {identity === totalIdentity.ME ? (
                !edit ? (
                  <>
                    {record}
                    <span
                      className="edit-control"
                      onClick={() => setEdit(true)}
                    >
                      <EditOutlined></EditOutlined>&nbsp;编辑
                    </span>
                  </>
                ) : (
                  <>
                    <Input
                      type={"number"}
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                    ></Input>
                    <div className="btn-control">
                      <Button type="primary" onClick={sendMethod}>
                        保存
                      </Button>
                      <Button type="default" onClick={() => setEdit(false)}>
                        取消
                      </Button>
                    </div>
                  </>
                )
              ) : (
                record
              )}
            </div>
          </div>
        </Form.Item>
      );
    case "radio":
      return (
        <Form.Item className="form-item">
          <div className="form-item-inner">
            <div className="label">{props.label}</div>
            <div className="content">
              {identity === totalIdentity.ME ? (
                !edit ? (
                  <>
                    {record}
                    <span
                      className="edit-control"
                      onClick={() => setEdit(true)}
                    >
                      <EditOutlined></EditOutlined>&nbsp;编辑
                    </span>
                  </>
                ) : (
                  <>
                    <Radio.Group
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                    >
                      <Radio value={"男"}>男</Radio>
                      <Radio value={"女"}>女</Radio>
                    </Radio.Group>
                    <div className="btn-control">
                      <Button type="primary" onClick={sendMethod}>
                        保存
                      </Button>
                      <Button type="default" onClick={() => setEdit(false)}>
                        取消
                      </Button>
                    </div>
                  </>
                )
              ) : (
                record
              )}
            </div>
          </div>
        </Form.Item>
      );
    case "input":
      return (
        <Form.Item className="form-item">
          <div className="form-item-inner">
            <div className="label">{props.label}</div>
            <div className="content">
              {identity === totalIdentity.ME ? (
                !edit ? (
                  <>
                    {record}
                    <span
                      className="edit-control"
                      onClick={() => setEdit(true)}
                    >
                      <EditOutlined></EditOutlined>&nbsp;编辑
                    </span>
                  </>
                ) : (
                  <>
                    <Input
                      type={"text"}
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                    ></Input>
                    <br />
                    <div className="btn-control">
                      <Button type="primary" onClick={sendMethod}>
                        保存
                      </Button>
                      <Button type="default" onClick={() => setEdit(false)}>
                        取消
                      </Button>
                    </div>
                  </>
                )
              ) : (
                record
              )}
            </div>
          </div>
        </Form.Item>
      );
    case "email":
      return (
        <Form.Item className="form-item">
          <div className="form-item-inner">
            <div className="label">{props.label}</div>
            <div className="content">
              {identity === totalIdentity.ME ? (
                !edit ? (
                  <>
                    {record}
                    <span
                      className="edit-control"
                      onClick={() => setEdit(true)}
                    >
                      <EditOutlined></EditOutlined>&nbsp;编辑
                    </span>
                  </>
                ) : (
                  <>
                    <Input
                      type={"email"}
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                    ></Input>
                    <br />
                    <div className="btn-control">
                      <Button type="primary" onClick={sendMethod}>
                        保存
                      </Button>
                      <Button type="default" onClick={() => setEdit(false)}>
                        取消
                      </Button>
                    </div>
                  </>
                )
              ) : (
                record
              )}
            </div>
          </div>
        </Form.Item>
      );
    case "textarea":
      return (
        <Form.Item className="form-item">
          <div className="form-item-inner">
            <div className="label">{props.label}</div>
            <div className="content">
              {identity === totalIdentity.ME ? (
                !edit ? (
                  <>
                    {record}
                    <span
                      className="edit-control"
                      onClick={() => setEdit(true)}
                    >
                      <EditOutlined></EditOutlined>&nbsp;编辑
                    </span>
                  </>
                ) : (
                  <>
                    <Input.TextArea
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                    ></Input.TextArea>
                    <br />
                    <div className="btn-control">
                      <Button type="primary" onClick={sendMethod}>
                        保存
                      </Button>
                      <Button type="default" onClick={() => setEdit(false)}>
                        取消
                      </Button>
                    </div>
                  </>
                )
              ) : (
                record
              )}
            </div>
          </div>
        </Form.Item>
      );

    default:
      break;
  }
};

class Info extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar: {
        loading: false,
        url: "",
        change: false,
      },
      cover: {
        loading: false,
        url: "",
        change: false,
      },
    };
  }

  sendToUpdate = async (username, name, data) => {
    try {
      const response = await axios.put(`/api/user/${username}`, {
        name,
        data,
      });
      if (response && response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  componentDidMount() {
    this.props.get_info(this.props.params.username);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.params.username !== this.props.params.username) {
      this.props.get_info(this.props.params.username);
    }
    if (prevProps.targetInfo !== this.props.targetInfo) {
      this.setState({
        avatar: {
          loading: false,
          url: this.props.targetInfo.head_picture,
          change: false,
        },
        cover: {
          loading: false,
          url: this.props.targetInfo.cover,
        },
      });
    }
  }

  render() {
    console.log(this.props);
    let {
      age,
      foundtime,
      head_picture,
      sex,
      words,
      area,
      birthday,
      username,
      email,
    } = this.props.targetInfo;
    if (!area) {
      area = [];
    }
    return (
      <div className="component user-info">
        <div className="user-info-body">
          <div className="cover-warp">
            <div className="change-cover">
              {this.props.identity === totalIdentity.ME && (
                <ImgCrop rotate aspect={5}>
                  <Upload
                    action="/api/uploadIMG"
                    showUploadList={false}
                    name="picture"
                    onChange={async (info) => {
                      if (info.file.status === "uploading") {
                        this.setState({
                          cover: { ...this.state.cover, loading: true },
                        });
                        return;
                      }

                      if (info.file.status === "done") {
                        const ret = await this.sendToUpdate(
                          username,
                          "cover",
                          info.file.response
                        );
                        if (!ret) {
                          return;
                        }
                        this.setState({
                          cover: {
                            loading: false,
                            url: info.file.response,
                          },
                        });
                      }
                    }}
                  >
                    <span className="change-btn">
                      <SkinOutlined></SkinOutlined>更换封面
                    </span>
                  </Upload>
                </ImgCrop>
              )}
            </div>
            <img className="cover" src={this.state.cover.url}></img>
          </div>
          <div className="info">
            <div className="avatar-area">
              <div className="avatar-body">
                {this.props.identity === totalIdentity.ME ? (
                  <ImgCrop rotate>
                    <Upload
                      action="/api/uploadIMG"
                      listType="picture-card"
                      showUploadList={false}
                      name="picture"
                      onChange={(info) => {
                        if (info.file.status === "uploading") {
                          this.setState({
                            avatar: { ...this.state.avatar, loading: true },
                          });
                          return;
                        }

                        if (info.file.status === "done") {
                          // Get this url from response in real world.
                          this.setState({
                            avatar: {
                              loading: false,
                              url: info.file.response,
                              change: true,
                            },
                          });
                        }
                      }}
                    >
                      {this.state.avatar.url ? (
                        <img
                          src={this.state.avatar.url}
                          alt="avatar"
                          style={{
                            width: "100%",
                          }}
                        />
                      ) : (
                        <div>
                          {this.state.avatar.loading ? (
                            <LoadingOutlined />
                          ) : (
                            <PlusOutlined />
                          )}
                          <div
                            style={{
                              marginTop: 8,
                            }}
                          >
                            Upload
                          </div>
                        </div>
                      )}
                    </Upload>
                  </ImgCrop>
                ) : (
                  <img
                    src={this.state.avatar.url}
                    alt="avatar"
                    style={{
                      width: "100%",
                      marginBottom: "5px",
                    }}
                  />
                )}
                {this.state.avatar.change && (
                  <p>
                    <Button
                      type="primary"
                      onClick={async () => {
                        try {
                          const ret = await this.sendToUpdate(
                            username,
                            "head_picture",
                            this.state.avatar.url
                          );
                          if (!ret) {
                            return;
                          }
                          this.setState({
                            avatar: { ...this.state.avatar, change: false },
                          });
                        } catch (error) {
                          console.error(error);
                        }
                      }}
                    >
                      保存
                    </Button>
                  </p>
                )}

                {this.props.identity === totalIdentity.STRANGER && (
                  <p>
                    <Button
                      type="primary"
                      onClick={() =>
                        this.props.add_friend(
                          this.props.global.userInfo.username,
                          this.props.targetInfo.username
                        )
                      }
                    >
                      加为好友
                    </Button>
                  </p>
                )}
                {this.props.identity === totalIdentity.FRIEND && (
                  <p>
                    <Button
                      type="primary"
                      danger
                      onClick={() =>
                        this.props.delete_friend(
                          this.props.global.userInfo.username,
                          this.props.targetInfo.username
                        )
                      }
                    >
                      删除好友
                    </Button>
                  </p>
                )}
              </div>
            </div>
            <div className="info-body">
              <Card>
                <Form className="form">
                  <Form.Item className="form-item">
                    <div className="form-item-inner">
                      <div className="label">
                        <label>
                          <strong>用户名</strong>
                        </label>
                      </div>
                      <div className="content">{username}</div>
                    </div>
                  </Form.Item>
                  <Divider></Divider>
                  <FormItem
                    identity={this.props.identity}
                    sendToUpdate={this.sendToUpdate}
                    username={username}
                    name="sex"
                    type="radio"
                    label={
                      <label>
                        <strong>性别</strong>
                      </label>
                    }
                    content={sex}
                  ></FormItem>
                  <Divider></Divider>
                  <FormItem
                    identity={this.props.identity}
                    sendToUpdate={this.sendToUpdate}
                    username={username}
                    name="birthday"
                    type="date"
                    label={
                      <label>
                        <strong>生日</strong>
                      </label>
                    }
                    content={birthday}
                  ></FormItem>
                  <Divider></Divider>
                  <FormItem
                    identity={this.props.identity}
                    sendToUpdate={this.sendToUpdate}
                    username={username}
                    name="age"
                    type="number"
                    label={
                      <label>
                        <strong>年龄</strong>
                      </label>
                    }
                    content={age}
                  ></FormItem>
                  <Divider></Divider>
                  <FormItem
                    identity={this.props.identity}
                    sendToUpdate={this.sendToUpdate}
                    username={username}
                    name="area"
                    type="city"
                    label={
                      <label>
                        <strong>所在地区</strong>
                      </label>
                    }
                    content={area.join("")}
                  ></FormItem>
                  <Divider></Divider>
                  <FormItem
                    identity={this.props.identity}
                    sendToUpdate={this.sendToUpdate}
                    username={username}
                    name="email"
                    type="email"
                    label={
                      <label>
                        <strong>邮箱</strong>
                      </label>
                    }
                    content={email}
                  ></FormItem>
                  <Divider></Divider>
                  <FormItem
                    identity={this.props.identity}
                    sendToUpdate={this.sendToUpdate}
                    username={username}
                    name="words"
                    type="textarea"
                    label={
                      <label>
                        <strong>个性签名</strong>
                      </label>
                    }
                    content={words}
                  ></FormItem>
                  <Divider></Divider>
                </Form>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToPorps(state) {
  return {
    ...state.info,
    global: state.global,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    get_info: bindActionCreators(get_info, dispatch),
    add_friend: bindActionCreators(add_friend, dispatch),
    delete_friend: bindActionCreators(delete_friend, dispatch),
  };
}

export default connect(
  mapStateToPorps,
  mapDispatchToProps
)(withUseParamsHooksHOC(Info));
