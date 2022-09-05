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
} from "antd";
import { EditOutlined } from "@ant-design/icons";

import { actions } from "../../redux/info.js";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withUseParamsHooksHOC } from "../../tools/withUseParamsHooksHOC.jsx";
import { LoadingOutlined, PlusOutlined, SkinOutlined } from "@ant-design/icons";
const { get_info } = actions;
import moment from "moment";

import axios from "axios";

const options = [
  {
    value: "中国",
    label: "中国",
    children: [
      {
        value: "河北",
        label: "河北",
      },
      {
        value: "山西",
        label: "山西",
      },
      {
        value: "辽宁",
        label: "辽宁",
      },
      {
        value: "吉林",
        label: "吉林",
      },
      {
        value: "黑龙江",
        label: "黑龙江",
      },
      {
        value: "江苏",
        label: "江苏",
      },
      {
        value: "浙江",
        label: "浙江",
      },
      {
        value: "安徽",
        label: "安徽",
      },
      {
        value: "福建",
        label: "福建",
      },
      {
        value: "江西",
        label: "江西",
      },
      {
        value: "山东",
        label: "山东",
      },
      {
        value: "河南",
        label: "河南",
      },
      {
        value: "湖北",
        label: "湖北",
      },
      {
        value: "湖南",
        label: "湖南",
      },
      {
        value: "广东",
        label: "广东",
      },
      {
        value: "海南",
        label: "海南",
      },
      {
        value: "四川",
        label: "四川",
      },
      {
        value: "贵州",
        label: "贵州",
      },
      {
        value: "云南",
        label: "云南",
      },
      {
        value: "陕西",
        label: "陕西",
      },
      {
        value: "甘肃",
        label: "甘肃",
      },
      {
        value: "青海",
        label: "青海",
      },
      {
        value: "台湾",
        label: "台湾",
      },
      {
        label: "内蒙古",
        value: "内蒙古",
      },
      {
        label: "广西",
        value: "广西",
      },
      {
        label: "西藏",
        value: "西藏",
      },
      {
        label: "宁夏",
        value: "宁夏",
      },
      {
        label: "新疆",
        value: "新疆",
      },
      {
        label: "北京",
        value: "北京",
      },
      {
        label: "天津",
        value: "天津",
      },
      {
        label: "上海",
        value: "上海",
      },
      {
        label: "重庆",
        value: "重庆",
      },
      {
        label: "香港",
        value: "香港",
      },
      {
        label: "澳门",
        value: "澳门",
      },
    ],
  },
];

const pro = [];

const FormItem = (props) => {
  const { sendToUpdate, username, name, content } = props;
  // console.log(name, username, content);
  const sendMethod = async () => {
    try {
      const ret = await sendToUpdate(username, name, value);
      if (!ret) {
        return;
      }
      setEdit(false);
      setRecord(ret);
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
              {!edit ? (
                <>
                  {record}
                  <span className="edit-control" onClick={() => setEdit(true)}>
                    <EditOutlined></EditOutlined>&nbsp;编辑
                  </span>
                </>
              ) : (
                <>
                  <Cascader
                    options={options}
                    defaultValue={["中国", "广西"]}
                    onChange={() => null}
                    placeholder="请选择"
                  />
                  <div className="btn-control">
                    <Button type="primary" onClick={() => setEdit(false)}>
                      保存
                    </Button>
                    <Button type="default" onClick={() => setEdit(false)}>
                      取消
                    </Button>
                  </div>
                </>
              )}{" "}
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
              {!edit ? (
                <>
                  {record}
                  <span className="edit-control" onClick={() => setEdit(true)}>
                    <EditOutlined></EditOutlined>&nbsp;编辑
                  </span>
                </>
              ) : (
                <>
                  <DatePicker
                    defaultValue={moment(record, "YYYY年MM月DD日")}
                    onChange={(value) => {
                      setValue(value ? value.format("YYYY年MM月DD日") : "");
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
              )}{" "}
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
              {!edit ? (
                <>
                  {record}
                  <span className="edit-control" onClick={() => setEdit(true)}>
                    <EditOutlined></EditOutlined>&nbsp;编辑
                  </span>
                </>
              ) : (
                <>
                  <Input type={"number"}></Input>
                  <div className="btn-control">
                    <Button type="primary" onClick={() => setEdit(false)}>
                      保存
                    </Button>
                    <Button type="default" onClick={() => setEdit(false)}>
                      取消
                    </Button>
                  </div>
                </>
              )}{" "}
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
              {!edit ? (
                <>
                  {record}
                  <span className="edit-control" onClick={() => setEdit(true)}>
                    <EditOutlined></EditOutlined>&nbsp;编辑
                  </span>
                </>
              ) : (
                <>
                  <p>
                    男
                    <Input
                      type={"radio"}
                      name="sex"
                      className="radio"
                      size="large"
                      checked
                    ></Input>
                    女
                    <Input
                      type={"radio"}
                      name="sex"
                      className="radio"
                      size="large"
                    ></Input>
                  </p>
                  <div className="btn-control">
                    <Button type="primary" onClick={() => setEdit(false)}>
                      保存
                    </Button>
                    <Button type="default" onClick={() => setEdit(false)}>
                      取消
                    </Button>
                  </div>
                </>
              )}{" "}
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
              {!edit ? (
                <>
                  {record}
                  <span className="edit-control" onClick={() => setEdit(true)}>
                    <EditOutlined></EditOutlined>&nbsp;编辑
                  </span>
                </>
              ) : (
                <>
                  <Input type={"text"}></Input>
                  <br />
                  <div className="btn-control">
                    <Button type="primary" onClick={() => setEdit(false)}>
                      保存
                    </Button>
                    <Button type="default" onClick={() => setEdit(false)}>
                      取消
                    </Button>
                  </div>
                </>
              )}{" "}
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
              {!edit ? (
                <>
                  {record}
                  <span className="edit-control" onClick={() => setEdit(true)}>
                    <EditOutlined></EditOutlined>&nbsp;编辑
                  </span>
                </>
              ) : (
                <>
                  <Input type={"email"}></Input>
                  <br />
                  <div className="btn-control">
                    <Button type="primary" onClick={() => setEdit(false)}>
                      保存
                    </Button>
                    <Button type="default" onClick={() => setEdit(false)}>
                      取消
                    </Button>
                  </div>
                </>
              )}{" "}
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
              {!edit ? (
                <>
                  {record}
                  <span className="edit-control" onClick={() => setEdit(true)}>
                    <EditOutlined></EditOutlined>&nbsp;编辑
                  </span>
                </>
              ) : (
                <>
                  <Input.TextArea></Input.TextArea>
                  <br />
                  <div className="btn-control">
                    <Button type="primary" onClick={() => setEdit(false)}>
                      保存
                    </Button>
                    <Button type="default" onClick={() => setEdit(false)}>
                      取消
                    </Button>
                  </div>
                </>
              )}{" "}
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
            </div>
            <img className="cover" src={this.state.cover.url}></img>
          </div>
          <div className="info">
            <div className="avatar-area">
              <div className="avatar-body">
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
                <p>
                  {this.state.avatar.change && (
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
                  )}
                </p>
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
  };
}

function mapDispatchToProps(dispatch) {
  return {
    get_info: bindActionCreators(get_info, dispatch),
  };
}

export default connect(
  mapStateToPorps,
  mapDispatchToProps
)(withUseParamsHooksHOC(Info));
