import React from "react";
import "./index.scss";
import {
  Avatar,
  Form,
  Input,
  Button,
  Card,
  Divider,
  Cascader,
  DatePicker,
} from "antd";
import { EditOutlined } from "@ant-design/icons";

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
  const [edit, setEdit] = React.useState(false);
  switch (props.type) {
    case "city":
      return (
        <Form.Item className="form-item">
          <div className="form-item-inner">
            <div className="label">{props.label}</div>
            <div className="content">
              {!edit ? (
                <>
                  {props.content}
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
                  {props.content}
                  <span className="edit-control" onClick={() => setEdit(true)}>
                    <EditOutlined></EditOutlined>&nbsp;编辑
                  </span>
                </>
              ) : (
                <>
                  <Input type={"date"}></Input>
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
    case "number":
      return (
        <Form.Item className="form-item">
          <div className="form-item-inner">
            <div className="label">{props.label}</div>
            <div className="content">
              {!edit ? (
                <>
                  {props.content}
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
                  {props.content}
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
                  {props.content}
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
                  {props.content}
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
                  {props.content}
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
  }

  render() {
    return (
      <div className="component user-info">
        <div className="user-info-body">
          <div className="cover-warp">
            <div className="cover"></div>
          </div>
          <div className="info">
            <div className="avatar-area">
              <Avatar className="avatar" shape="square"></Avatar>
            </div>
            <div className="info-body">
              <Card>
                <Form className="form">
                  <FormItem
                    type="input"
                    label={
                      <label>
                        <strong>用户名</strong>
                      </label>
                    }
                    content={<>MillNasis</>}
                  ></FormItem>
                  <Divider></Divider>
                  <FormItem
                    type="radio"
                    label={
                      <label>
                        <strong>性别</strong>
                      </label>
                    }
                    content={<>男</>}
                  ></FormItem>
                  <Divider></Divider>
                  <FormItem
                    type="date"
                    label={
                      <label>
                        <strong>生日</strong>
                      </label>
                    }
                    content={<>2022年9月1日</>}
                  ></FormItem>
                  <Divider></Divider>
                  <FormItem
                    type="number"
                    label={
                      <label>
                        <strong>年龄</strong>
                      </label>
                    }
                    content={<>19</>}
                  ></FormItem>
                  <Divider></Divider>
                  <FormItem
                    type="city"
                    label={
                      <label>
                        <strong>所在地区</strong>
                      </label>
                    }
                    content={<>广西 南宁</>}
                  ></FormItem>
                  <Divider></Divider>
                  <FormItem
                    type="email"
                    label={
                      <label>
                        <strong>邮箱</strong>
                      </label>
                    }
                    content={<>1985551393@qq.com</>}
                  ></FormItem>
                  <Divider></Divider>
                  <FormItem
                    type="textarea"
                    label={
                      <label>
                        <strong>个性签名</strong>
                      </label>
                    }
                    content={
                      <>
                        这是一个很长很长很很长很长很很长很长很很长很长很很长很长很很长很长很很长很长很很长很长很很长很长很很长很长很很长很长很很长很长很很长很长很很长很长很很长很长很很长很长很很长很长很很长很长很很长很长很很长很长很很长很长很很长很长很很长很长很长很长很长很长很长很长很长的个性签名
                      </>
                    }
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

export default Info;
