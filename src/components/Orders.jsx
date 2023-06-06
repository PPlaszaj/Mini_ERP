import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Space, Table, Popconfirm, message, Layout, theme } from "antd";
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
  //sp0rawdzenie czy zalogowany
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
      onClick: () => navigation(`/orders/${record.id}`),
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

  return (
    <Layout className="layout" style={{ height: "100%", minHeight: "100vh" }}>
      <SideBar />
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

                    // Sprawdź, czy kliknięcie wystąpiło w pierwszych czterech kolumnach żeby dało się kliknąc dewlete
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
