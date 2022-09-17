import React from "react";
import axios from "axios";
import ImgCrop from "antd-img-crop";
import {
  Card,
  Divider,
  Form,
  Image,
  Button,
  Input,
  DatePicker,
  List,
  Avatar,
  Upload,
} from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import "./index.scss";
import moment from "moment";
import { momentFormat, totalIdentity } from "../../../constant";
import { withUseParamsHooksHOC } from "../../tools/withUseParamsHooksHOC.jsx";
import { withUseNavigateHooksHOC } from "../../tools/withUseNavigateHooksHOC.jsx";

import { actions } from "../../redux/groupInfo.js";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
const { get_group_info, join_group, quit_group } = actions;

const FormItem = (props) => {
  const { sendToUpdate, room_id, name, content, identity } = props;
  const sendMethod = async () => {
    try {
      const ret = await sendToUpdate(room_id, name, value);
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
              {identity === totalIdentity.OWNER ? (
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
                      options={options}
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
              {identity === totalIdentity.OWNER ? (
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
              {identity === totalIdentity.OWNER ? (
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
              {identity === totalIdentity.OWNER ? (
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
              {identity === totalIdentity.OWNER ? (
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
              {identity === totalIdentity.OWNER ? (
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
              {identity === totalIdentity.OWNER ? (
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

class GroupInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      avatar: {
        loading: false,
        url: "",
        change: false,
      },
    };
  }

  componentDidMount() {
    this.props.get_group_info(this.props.params.groupid);
    this.setState({
      avatar: {
        loading: false,
        url: this.props.targetInfo.head_picture,
        change: false,
      },
    });
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.targetInfo !== this.props.targetInfo &&
      this.props.targetInfo.head_picture
    ) {
      this.setState({
        avatar: {
          loading: false,
          url: this.props.targetInfo.head_picture,
          change: false,
        },
      });
    }
  }

  sendToUpdate = async (room_id, name, data) => {
    try {
      const response = await axios.put(`/api/group/${room_id}`, {
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

  render() {
    const { targetInfo, identity } = this.props;
    let { room_name, room_id, owner, member, words, foundtime, head_picture } =
      targetInfo;
    if (!Array.isArray(member)) {
      member = [];
    }
    return (
      <div className="component group-info">
        <div className="group-info-body">
          <div className="group-info-cover">
            <div
              className="group-info-blur"
              style={{ backgroundImage: `url(${head_picture})` }}
            ></div>
            {this.state.avatar.change && (
              <Button
                style={{ zIndex: "5", marginBottom: "10px" }}
                onClick={async () => {
                  try {
                    const ret = await this.sendToUpdate(
                      room_id,
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
                保存头像
              </Button>
            )}
            <div className="group-info-avatar">
              {identity === totalIdentity.OWNER ? (
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
                          height: "100%",
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
                <Image src={head_picture} height={"100%"}></Image>
              )}
            </div>
            <span className="title">{room_name}</span>
            <div className="group-info-btn">
              {identity === totalIdentity.STRANGER && (
                <Button
                  onClick={() =>
                    this.props.join_group(
                      room_id,
                      this.props.global.userInfo.username,
                      owner
                    )
                  }
                >
                  加入群聊
                </Button>
              )}
              {identity === totalIdentity.FRIEND && (
                <Button type="primary" danger>
                  退出群聊
                </Button>
              )}
              {identity === totalIdentity.OWNER && (
                <Button type="primary" danger>
                  解散群聊
                </Button>
              )}
            </div>
          </div>
          <div className="group-info-specific">
            <h2 className="title">群信息</h2>
            <Divider></Divider>
            <Form className="form">
              <FormItem
                room_id={room_id}
                sendToUpdate={this.sendToUpdate}
                identity={identity}
                label={
                  <label>
                    <strong>群名称</strong>
                  </label>
                }
                type="input"
                name="room_name"
                content={room_name}
              ></FormItem>
              <Divider></Divider>
              <FormItem
                room_id={room_id}
                sendToUpdate={this.sendToUpdate}
                identity={identity}
                type="textarea"
                name="words"
                content={words}
                label={
                  <label>
                    <strong>群介绍</strong>
                  </label>
                }
              ></FormItem>
              <Divider></Divider>
              <FormItem
                room_id={room_id}
                sendToUpdate={this.sendToUpdate}
                identity={false}
                type="date"
                name="date"
                label={
                  <label>
                    <strong>创建日期</strong>
                  </label>
                }
                content={foundtime}
              ></FormItem>
              <Divider></Divider>
              <Card
                className="group-member-list"
                title={
                  <label>
                    <strong style={{ fontSize: "1.4em" }}>
                      {`群成员（共${member.length}位）`}
                    </strong>
                  </label>
                }
              >
                <List
                  dataSource={member}
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
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    global: state.global,
    ...state.groupInfo,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    get_group_info: bindActionCreators(get_group_info, dispatch),
    join_group: bindActionCreators(join_group, dispatch),
    quit_group: bindActionCreators(quit_group, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withUseParamsHooksHOC(withUseNavigateHooksHOC(GroupInfo)));
