import React from "react";
import { Card, Divider, Form, Image, Button, Input, DatePicker } from "antd";
import { EditOutlined } from "@ant-design/icons";
import "./index.scss";
import moment from "moment";
import { momentFormat } from "../../../constant";

const FormItem = (props) => {
  const { sendToUpdate, username, name, content, identity } = props;
  const sendMethod = async () => {
    try {
      // const ret = await sendToUpdate(username, name, value);
      // if (!ret) {
      //   return;
      // }
      // setEdit(false);
      // setRecord(ret);
      // setValue(ret);
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
              {true ? (
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
              {true ? (
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
              {true ? (
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
              {true ? (
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
              {true ? (
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
              {true ? (
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
              {true ? (
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
  }

  render() {
    return (
      <div className="component group-info">
        <div className="group-info-body">
          <div className="group-info-cover">
            <div className="group-info-avatar">
              <Image src="/public/img/logo.png" height={"100%"}></Image>
            </div>
            <h2>我是嫩爹我是嫩爹啊</h2>
          </div>
          <div className="group-info-specific">
            <h2>群信息</h2>
            <Divider></Divider>
            <Form className="form">
              <Form.Item className="form-item">
                <div className="form-item-inner">
                  <div className="label">
                    <label>
                      <strong>群名称</strong>
                    </label>
                  </div>
                  <div className="content">{"我是嫩爹"}</div>
                </div>
              </Form.Item>
              <Divider></Divider>
              <FormItem
                type="textarea"
                name="words"
                content={"我是嫩爹"}
                label={
                  <label>
                    <strong>群介绍</strong>
                  </label>
                }
              ></FormItem>
              <Divider></Divider>
              <FormItem
                type="date"
                name="date"
                label={
                  <label>
                    <strong>创建日期</strong>
                  </label>
                }
                content={new Date().toString()}
              ></FormItem>
              <Divider></Divider>
              
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

export default GroupInfo;
