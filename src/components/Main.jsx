import {
  Layout,
  theme,
  Card,
  Col,
  Row,
  Statistic,
  Divider,
  Progress,
} from "antd";
import { useEffect, useState } from "react";
import SideBars from "./SideBar";
import supabase from "../services/supabase";

const { Header, Content, Footer } = Layout;

const Main = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase.from("Orders").select("*");
      if (!error) {
        setData(data);
      } else {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProducts = async (orderNumber) => {
    try {
      const { data, error } = await supabase
        .from("Products")
        .select("*")
        .eq("order_number", orderNumber);

      if (!error) {
        return data;
      } else {
        console.log(error);
        return [];
      }
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const getOrderStatusCount = () => {
    const inProgressCount = data.filter(
      (order) => order.status === "In progress"
    ).length;
    const finishedCount = data.filter(
      (order) => order.status === "Ready"
    ).length;

    return { inProgressCount, finishedCount };
  };

  const calculateCompletionPercentage = () => {
    const { inProgressCount, finishedCount } = getOrderStatusCount();
    const totalOrders = inProgressCount + finishedCount;

    if (totalOrders === 0) {
      return 0;
    }

    return Math.round((finishedCount / totalOrders) * 100);
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const orderStatusCount = getOrderStatusCount();
  const completionPercentage = calculateCompletionPercentage();

  const inProgressOrders = data.filter(
    (order) => order.status === "In progress"
  );

  useEffect(() => {
    const fetchProductsData = async () => {
      const inProgressOrdersWithProducts = await Promise.all(
        inProgressOrders.map(async (order) => {
          const products = await fetchProducts(order.order_number);
          return {
            ...order,
            orderedProductCount: products.filter((product) => product.status)
              .length,
            toOrderProductCount: products.filter((product) => !product.status)
              .length,
          };
        })
      );

      setData((prevData) =>
        prevData.map((order) => {
          const updatedOrder = inProgressOrdersWithProducts.find(
            (o) => o.order_number === order.order_number
          );
          if (updatedOrder) {
            return {
              ...order,
              orderedProductCount: updatedOrder.orderedProductCount,
              toOrderProductCount: updatedOrder.toOrderProductCount,
            };
          }
          return order;
        })
      );
    };

    if (inProgressOrders.length > 0) {
      fetchProductsData();
    }
  }, [data, inProgressOrders]);

  return (
    <Layout className="layout" style={{ height: "100%", minHeight: "100vh" }}>
      <SideBars />
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            textAlign: "center",
          }}
        >
          <h2>Dashboard</h2>
        </Header>

        <Content style={{ margin: "24px 16px 0" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
            }}
          >
            <Divider orientation="left">Orders Status</Divider>
            <Row gutter={16}>
              <Col span={12}>
                <Card>
                  <Statistic
                    title="In Progress"
                    value={orderStatusCount.inProgressCount}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card>
                  <Statistic
                    title="Finished"
                    value={orderStatusCount.finishedCount}
                  />
                </Card>
              </Col>
            </Row>
            <Divider orientation="center">Orders Completion</Divider>
            <Row justify="center">
              <Col span={18}>
                <Progress percent={completionPercentage} />
              </Col>
            </Row>
            <Divider orientation="left">In Progress Orders</Divider>
            <Row gutter={16}>
              {inProgressOrders.map((order) => (
                <Col span={8} key={order.id}>
                  <Card title={order.order_number}>
                    <Statistic
                      title="Ordered Products"
                      value={order.orderedProductCount}
                    />
                    <Statistic
                      title="Products To Order"
                      value={order.toOrderProductCount}
                    />
                    <div style={{ marginTop: 16 }}>
                      <Progress
                        type="circle"
                        percent={Math.round(
                          (order.orderedProductCount /
                            (order.orderedProductCount +
                              order.toOrderProductCount)) *
                            100
                        )}
                      />
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©2023 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Main;
