import { Form, Space, Table, Tag, Button, Modal, Input } from "antd";

import { useState } from "react";
import "../styles/Orders.css";
import OrdersModal from "./OrdersModal";

const columns = [
  {
    title: "Order Number",
    dataIndex: "name",
    key: "name",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Order Name",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Creatind Data",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "DeadLine",
    key: "tags",
    dataIndex: "tags",
    render: (_, { tags }) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 5 ? "geekblue" : "green";
          if (tag === "loser") {
            color = "volcano";
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <a>Edit </a>
        <a>Delete</a>
      </Space>
    ),
  },
];
const data = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    tags: ["nice", "developer"],
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    tags: ["loser"],
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
];

const Orders = () => {
  return (
    <>
      <OrdersModal />
      <Table columns={columns} dataSource={data} />;
    </>
  );
};

export default Orders;
