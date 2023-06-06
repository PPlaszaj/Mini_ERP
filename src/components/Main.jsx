import { Layout, Menu, theme } from "antd";

import supabase from "../services/supabase";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import SideBars from "./SideBar";

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

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout className="layout" style={{ height: "100vh" }}>
      <SideBars />
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
          ></div>
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
