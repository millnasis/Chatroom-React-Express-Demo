import React from "react";
import { Button, Card, Form, Input, Upload, Transfer } from "antd";
import "./index.scss";
import ImgCrop from "antd-img-crop";

const { Item } = Form;
const mockData = Array.from({
  length: 20,
}).map((_, i) => ({
  key: i.toString(),
  title: `content${i + 1}`,
  description: `description of content${i + 1}`,
}));

class CreateRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar: [],
      targetKeys: [],
      selectedKeys: [],
    };
  }

  render() {
    return (
      <div className="component create-room">
        <div className="create-room-body">
          <Card
            title="新建群聊"
            headStyle={{ fontSize: "5vmin" }}
            bodyStyle={{ paddingRight: "5vw", paddingLeft: "5vw" }}
          >
            <Form>
              <Item label="群聊名称" required>
                <Input></Input>
              </Item>
              <Item label="群聊头像" required>
                <ImgCrop rotate>
                  <Upload
                    action="/api/upload/avatar"
                    listType="picture-card"
                    fileList={this.state.avatar}
                    name="avatar"
                    onChange={(e) => {
                      this.setState({ avatar: e.fileList });
                    }}
                    maxCount={1}
                  >
                    + 上传新头像
                  </Upload>
                </ImgCrop>
              </Item>
              <Item label="邀请好友">
                <Transfer
                  dataSource={mockData}
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
              <Item wrapperCol={{ offset: 12, span: 6 }}>
                <Button type="primary" style={{ width: "120px" }}>
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

export default CreateRoom;
