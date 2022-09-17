import React from "react";
import { Button, Card, Form, Input, Upload, Transfer } from "antd";
import "./index.scss";
import ImgCrop from "antd-img-crop";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import { actions } from "../../redux/createroom.js";
import { bindActionCreators } from "redux";
const { create_room } = actions;

const { Item } = Form;

class CreateRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar: {
        loading: false,
        url: "",
      },
      targetKeys: [],
      selectedKeys: [],
      dataSource: [],
    };
  }

  componentDidMount() {
    if (Array.isArray(this.props.chatroom.friendArray)) {
      let handleData = [];
      this.props.chatroom.friendArray.forEach((e) => {
        handleData = handleData.concat(e.arr);
      });
      this.setState({
        dataSource: handleData.map((v) => {
          return {
            key: v.room_name.username,
            title: v.room_name.username,
          };
        }),
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.chatroom.friendArray !== this.props.chatroom.friendArray) {
      if (Array.isArray(this.props.chatroom.friendArray)) {
        let handleData = [];
        this.props.chatroom.friendArray.forEach((e) => {
          handleData = handleData.concat(e.arr);
        });
        this.setState({
          dataSource: handleData.map((v) => {
            return {
              key: v.room_name.username,
              title: v.room_name.username,
            };
          }),
        });
      }
    }
  }

  render() {
    console.log(this.state.dataSource);
    return (
      <div className="component create-room">
        <div className="create-room-body">
          <Card
            title="新建群聊"
            headStyle={{ fontSize: "5vmin" }}
            bodyStyle={{ paddingRight: "5vw", paddingLeft: "5vw" }}
          >
            <Form
              onFinish={(value) => {
                const { room_name, words } = value;
                const { targetKeys, avatar } = this.state;
                this.props.create_room(
                  room_name,
                  this.props.global.userInfo.username,
                  targetKeys,
                  avatar.url,
                  words
                );
              }}
            >
              <Item label="群聊名称" required name={"room_name"}>
                <Input></Input>
              </Item>
              <Item label="群介绍" required name={"words"}>
                <Input.TextArea></Input.TextArea>
              </Item>
              <Item label="群聊头像" required>
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
              </Item>
              <Item label="邀请好友">
                <Transfer
                  dataSource={this.state.dataSource}
                  titles={["我的好友", "邀请列表"]}
                  targetKeys={this.state.targetKeys}
                  selectedKeys={this.state.selectedKeys}
                  onChange={(targetKeys, direction, moveKeys) => {
                    console.log("targetKeys:", targetKeys);
                    console.log("direction:", direction);
                    console.log("moveKeys:", moveKeys);
                    this.setState({ targetKeys });
                  }}
                  onSelectChange={(sourceSelectedKeys, targetSelectedKeys) => {
                    console.log("sourceSelectedKeys:", sourceSelectedKeys);
                    console.log("targetSelectedKeys:", targetSelectedKeys);
                    this.setState({
                      selectedKeys: [
                        ...sourceSelectedKeys,
                        ...targetSelectedKeys,
                      ],
                    });
                  }}
                  showSearch
                  onSearch={(direction, value) => {
                    console.log(direction, value);
                  }}
                  render={(item) => item.title}
                />
              </Item>
              <Item>
                <Button
                  type="primary"
                  style={{ width: "120px" }}
                  htmlType="submit"
                  loading={this.props.loading}
                >
                  创建
                </Button>
              </Item>
            </Form>
          </Card>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    chatroom: state.chatroom,
    global: state.global,
    ...state.createroom,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    create_room: bindActionCreators(create_room, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateRoom);
