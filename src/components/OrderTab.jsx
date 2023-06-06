import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout, theme } from "antd";
import supabase from "../services/supabase";
import SideBar from "./SideBar";
import ProductModal from "./ProductModal";
import OrderTabTable from "./OrderTabTable";

const { Header, Content, Footer } = Layout;

const Orders = () => {
  const { id } = useParams();

  const navigation = useNavigate();
  let alreadyMounted = false;

  // Sprawdzenie, czy użytkownik jest zalogowany
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

  // Pobieranie danych z Supabase dotyczących zamówienia

  const [data, setData] = useState([]);
  useEffect(() => {
    getOrder();
  }, []);
  const getOrder = async () => {
    try {
      const { data, error } = await supabase
        .from("Orders")
        .select()
        .eq("id", id);
      if (!error) {
        setData(data);
      } else {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  //dodawanie części

  return (
    <Layout className="layout" style={{ height: "100vh" }}>
      <SideBar />
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            textAlign: "center",
          }}
        >
          <h2>
            Order number: {data.length > 0 ? data[0].order_number : ""}, Order
            name: {data.length > 0 ? data[0].order_name : "Loading..."}
          </h2>
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
            <ProductModal />
            <OrderTabTable myProp={data} />
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

export default Orders;
