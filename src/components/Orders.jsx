import { useEffect, useState } from "react";
import { Space, Table, Button, Popconfirm, message } from "antd";
import OrdersModal from "./OrdersModal";
import supabase from "../services/supabase";

const Orders = () => {
  const [data, setData] = useState([]);
  const [key, setKey] = useState(0);
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
      setKey((key) => key + 1);
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
        fetchOrders(); // Odświeżenie danych po usunięciu wpisu
      } else {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
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
      dataIndex: "creating_date",
      key: "creatingDate",
    },
    {
      title: "Deadline",
      key: "deadline",
      dataIndex: "deadline",
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
    <>
      <OrdersModal />
      <Table
        pagination={false}
        style={{ margin: "20px" }}
        columns={columns}
        dataSource={data.map((item) => ({ ...item, key: item.id }))}
        key={key}
      />
    </>
  );
};

export default Orders;
