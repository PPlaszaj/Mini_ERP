import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import { Typography } from "antd";
import "../styles/SignIn.css";
import supabase from "../services/supabase";

function SignIn() {
  const [form] = Form.useForm();
  const [, forceUpdate] = useState({});
  const navigation = useNavigate();

  // To disable submit button at the beginning.
  useEffect(() => {
    forceUpdate({});
  }, []);
  const onFinish = async (values) => {
    let { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    if (!error) {
      navigation("/");
    }
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
        <Typography.Title>Sign in</Typography.Title>
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your email!",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="E-mail"
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
        <Link to="/signup">Sign Up</Link>
      </Form>
    </div>
  );
}
export default SignIn;
