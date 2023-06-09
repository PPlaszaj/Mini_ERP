import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout, theme } from "antd";
import supabase from "../services/supabase";
import SideBar from "./SideBar";
import ProductTable from "./ProductsTable";

const { Header, Content, Footer } = Layout;

const Products = () => {
  // spraqwdzenie czy użytkowanik jest zalogowany
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
    <Layout className="layout">
      <SideBar />
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            textAlign: "center",
          }}
        >
          <h2>All products</h2>
        </Header>
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
            <ProductTable />
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
export default Products;
