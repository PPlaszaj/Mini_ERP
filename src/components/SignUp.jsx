import React, { useEffect, useState } from "react";
import supabase from "../services/supabase";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import { Typography } from "antd";
import "../styles/SignUp.css";
import { useNavigate, Link } from "react-router-dom";

function SignUp() {
  const navigation = useNavigate();
  const [form] = Form.useForm();
  const [, forceUpdate] = useState({});

  useEffect(() => {
    forceUpdate({});
  }, []);
  const onFinish = async (values) => {
    if (values.password != values.passwordRepeat) {
      alert("passwords have to be the same!");
      return;
    }
    let { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
    });
    if (!error) {
      navigation("/");
    }
  };
  return (
    <div className="signUpBg">
      <Form
        form={form}
        name="horizontal_login"
        layout="block"
        onFinish={onFinish}
        className="SignUpForm"
      >
        <Typography.Title>Sign Up</Typography.Title>
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
            type="email"
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
            id="Password"
          />
        </Form.Item>
        <Form.Item
          name="passwordRepeat"
          rules={[
            {
              required: true,
              message: "Please reapeat your password!",
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Repeat Password"
            id="passwordRepeat"
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
              Sign Up
            </Button>
          )}
        </Form.Item>
        <Link to="/signin">Sign In</Link>
      </Form>
    </div>
  );
}
export default SignUp;
