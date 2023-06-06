import supabase from "../services/supabase";
import { Table, Popconfirm, Space, message } from "antd";
import { useEffect, useState } from "react";
import React from "react";

const OrderTabTable = (props) => {
  const orderNumber =
    props.myProp.length > 0 ? props.myProp[0].order_number : null;
  const [products, setProducts] = useState([]);

  //łapanie danych o produktach danego zlecenia z supabase
  useEffect(() => {
    fetchOrderProducts();
  }, []);

  const fetchOrderProducts = async () => {
    try {
      const { data, error } = await supabase.from("Products").select("*");
      if (!error) {
        setProducts(data);
      } else {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // obsługa usunięcia wpisu
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
  /// filtrowanie tabeli z produktów tylko dla tego zlecenia

  const filteredProducts = products.filter((item) =>
    item.order_number.toString().includes(orderNumber)
  );
  // dane tabeli
  const columns = [
    {
      title: "Product name",
      dataIndex: "product_name",
      key: "productName",
    },
    {
      title: "Index",
      dataIndex: "index",
      key: "index",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Delivery Date",
      key: "delivery_date",
      dataIndex: "deliveryDate",
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
    <Table
      pagination={false}
      columns={columns}
      dataSource={filteredProducts.map((item) => ({ ...item, key: item.id }))}
    />
  );
};

export default OrderTabTable;
