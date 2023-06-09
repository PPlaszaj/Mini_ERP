import supabase from "../services/supabase";
import { Table, Popconfirm, Space, message, Tag } from "antd";
import { useEffect, useState } from "react";
import React from "react";
import ProductModal from "./ProductModal";

const OrderTabTable = (props) => {
  const orderNumber =
    props.myProp.length > 0 ? props.myProp[0].order_number : null;
  const [products, setProducts] = useState([]);

  const [refreshTable, setRefreshTable] = useState(false);

  useEffect(() => {
    fetchOrderProducts();
  }, [refreshTable]);

  const fetchOrderProducts = async () => {
    try {
      const { data, error } = await supabase.from("Products").select("*");
      if (!error) {
        setProducts(data);
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
        .from("Products")
        .delete()
        .eq("id", record.id);
      if (!error) {
        message.success("Order deleted successfully");
        setRefreshTable(true);
      } else {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  //zmiana statusu z To order na ordered
  const handleStatusChange = async (record) => {
    try {
      const { error } = await supabase
        .from("Products")
        .update({ status: true })
        .eq("id", record.id);
      if (!error) {
        message.success("Status changed to 'Ordered'");
        setRefreshTable(true);
      } else {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  //zmiana statusu z ordered na to order
  const handleStatusRevert = async (record) => {
    try {
      const { error } = await supabase
        .from("Products")
        .update({ status: false })
        .eq("id", record.id);
      if (!error) {
        message.success("Status changed to 'To Order'");
        setRefreshTable(true);
      } else {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const filteredProducts = products.filter((item) =>
    item.order_number.toString().includes(orderNumber)
  );

  const formatDate = (dateString) => {
    if (!dateString) {
      return "";
    }

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleDateString();
  };

  const columns = [
    {
      title: "Product name",
      dataIndex: "product_name",
      key: "productName",
      sorter: (a, b) => a.product_name.localeCompare(b.product_name), // Add sorter function
      sortDirections: ["ascend", "descend"],
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
      title: "Category",
      dataIndex: "category",
      key: "category",

      filters: [...new Set(products.map((item) => item.category))].map(
        (category) => ({
          text: category,
          value: category,
        })
      ),
      onFilter: (value, record) => record.category === value,
    },
    {
      title: "Delivery date",
      key: "delivery_date",
      dataIndex: "delivery_date",
      render: (text) => formatDate(text),
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      filters: [
        { text: "To Order", value: false },
        { text: "Ordered", value: true },
      ],
      onFilter: (value, record) => record.status === value,
      render: (_, record) => {
        let color = record.status ? "green" : "volcano";
        let tagText = record.status ? "Ordered" : "To Order";

        return (
          <Tag color={color} key={record.status}>
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
          {!record.status ? (
            <a onClick={() => handleStatusChange(record)}>Mark as Ordered</a>
          ) : (
            <a onClick={() => handleStatusRevert(record)}>Mark as To Order</a>
          )}
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
      <ProductModal setRefreshTable={setRefreshTable} />
      <Table
        style={{ marginTop: "30px" }}
        scroll={{ y: 640 }}
        pagination={false}
        columns={columns}
        dataSource={filteredProducts.map((item) => ({ ...item, key: item.id }))}
      />
    </>
  );
};

export default OrderTabTable;
