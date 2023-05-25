import { Layout, Menu, theme } from "antd";

import {
  HomeFilled,
  LogoutOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import supabase from "../services/supabase";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Orders from "./Orders";

const { Header, Content, Footer, Sider } = Layout;

const Main = () => {
  const navigation = useNavigate();
  let alreadyMounted = false;

  useEffect(() => {
    if (!alreadyMounted) {
      getSession();
    }
    alreadyMounted = true;
  }, []);

  const getSession = async () => {
    const { data, error } = await supabase.auth.getSession();

    if (!data.session) {
      navigation("/signin");
    }
  };
  const handleLogout = async () => {
    let { error } = await supabase.auth.signOut();

    if (!error) {
      navigation("/signin");
    }
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout className="layout" style={{ height: "100vh" }}>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["4"]}
          items={[
            { label: "Home", key: "home", icon: <HomeFilled /> },
            { label: "Orders", key: "orders", icon: <ShoppingCartOutlined /> },
            {
              label: "products",
              key: "products",
              icon: <ShoppingCartOutlined />,
            },
            {
              label: "Signout",
              key: "signout",
              danger: true,
              icon: <LogoutOutlined />,
              onClick: handleLogout,
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        />
        <Content
          style={{
            margin: "24px 16px 0",
          }}
        >
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
            }}
          >
            <Orders />
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          Ant Design ©2023 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};
export default Main;
