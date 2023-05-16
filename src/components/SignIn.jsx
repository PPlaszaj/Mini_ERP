import React, { useEffect, useState } from "react";

import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import { Typography } from "antd";
import "./SignIn.css";

function SignIn() {
  const [form] = Form.useForm();
  const [, forceUpdate] = useState({});
  const { Title } = Typography;

  // To disable submit button at the beginning.
  useEffect(() => {
    forceUpdate({});
  }, []);
  const onFinish = (values) => {
    console.log("Finish:", values);
  };
  return (
    <div className="signInBg">
      <Form
        form={form}
        name="horizontal_login"
        layout="block"
        onFinish={onFinish}
        className="SignInForm"
      >
        <Typography.Title>Login</Typography.Title>
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your username!",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Username"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item shouldUpdate>
          {() => (
            <Button
              type="primary"
              htmlType="submit"
              disabled={
                !form.isFieldsTouched(true) ||
                !!form.getFieldsError().filter(({ errors }) => errors.length)
                  .length
              }
            >
              Log in
            </Button>
          )}
        </Form.Item>
      </Form>
    </div>
  );
}
export default SignIn;
