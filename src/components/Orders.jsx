import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Space, Table, Popconfirm, message, Layout, Tag, theme } from "antd";
import OrdersModal from "./OrdersModal";
import supabase from "../services/supabase";
import SideBar from "./SideBar";

const { Header, Content, Footer } = Layout;

const Orders = () => {
  const [refreshTable, setRefreshTable] = useState(false);
  const handleOrderCreated = () => {
    setRefreshTable(true); // Ustawienie stanu, aby odświeżyć tabelę
  };
  const navigation = useNavigate();
  let alreadyMounted = false;
  const [data, setData] = useState([]);
  const [key, setKey] = useState(0);

  useEffect(() => {
    fetchOrders();
  }, [refreshTable]);

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

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase.from("Orders").select("*");
      if (!error) {
        setData(data);
      } else {
        console.log(error);
      }
      setRefreshTable(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchOrderProducts = async (orderNumber) => {
    try {
      const { data, error } = await supabase
        .from("Products")
        .select("status")
        .eq("order_number", orderNumber);

      if (!error) {
        const allProductsReady = data.every(
          (product) => product.status === true
        );

        if (allProductsReady) {
          updateOrderStatus(orderNumber, "Ready");
        } else {
          updateOrderStatus(orderNumber, "In progress");
        }
      } else {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateOrderStatus = async (orderNumber, status) => {
    try {
      const { data, error } = await supabase
        .from("Orders")
        .update({ status })
        .eq("order_number", orderNumber);

      if (!error) {
      } else {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (record) => {
    try {
      const { error } = await supabase
        .from("Orders")
        .delete()
        .eq("id", record.id);
      if (!error) {
        message.success("Order deleted successfully");
        setRefreshTable(true); // Trigger a refresh after deleting an entry
      } else {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const columns = [
    {
      title: "Order Number",
      dataIndex: "order_number",
      key: "orderNumber",
    },
    {
      title: "Order Name",
      dataIndex: "order_name",
      key: "orderName",
    },
    {
      title: "Creating Date",
      dataIndex: "created_at",
      key: "creatingDate",
      render: (text) => formatDate(text),
    },
    {
      title: "Deadline",
      key: "deadline",
      dataIndex: "deadline",
      render: (text) => formatDate(text),
    },
    {
      title: "Status",
      dataIndex: "order_number",
      key: "status",
      render: (orderNumber) => {
        const order = data.find((item) => item.order_number === orderNumber);
        let color = "";
        let tagText = "N/A";

        if (order) {
          if (order.status === "Ready") {
            color = "green";
            tagText = "Finished";
          } else if (order.status === "In progress") {
            color = "red";
            tagText = "In Progress";
          }
        }

        return (
          <Tag color={color} key={orderNumber}>
            {tagText}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="Are you sure you want to delete this order?"
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
            placement="leftTop"
          >
            <a>Delete</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    const fetchProductsData = async () => {
      const orderNumbers = data.map((item) => item.order_number);
      for (const orderNumber of orderNumbers) {
        await fetchOrderProducts(orderNumber);
      }
    };

    fetchProductsData();
  }, [data]);

  return (
    <Layout className="layout" style={{ height: "100%", minHeight: "100vh" }}>
      <SideBar />
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            textAlign: "center",
          }}
        >
          <h2>Orders</h2>
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
            <>
              <OrdersModal onOrderCreated={handleOrderCreated} />
              <Table
                pagination={false}
                style={{ margin: "20px", cursor: "pointer" }}
                columns={columns}
                dataSource={data.map((item) => ({ ...item, key: item.id }))}
                key={key}
                onRow={(record) => ({
                  onClick: (event) => {
                    const targetElement = event.target;
                    const columnIndex = targetElement.cellIndex;

                    if (columnIndex < 4) {
                      navigation(`/orders/${record.id}`);
                    }
                  },
                })}
              />
            </>
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
