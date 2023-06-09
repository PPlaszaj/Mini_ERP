import { Table } from "antd";
import { useEffect, useState } from "react";
import supabase from "../services/supabase";

const ProductTable = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase.from("Products").select();
      if (!error) {
        setProducts(data);
      } else {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      title: "Product Name",
      dataIndex: "product_name",
      key: "product_name",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Product Index",
      dataIndex: "index",
      key: "index",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Order number",
      dataIndex: "order_number",
      key: "order_number",
    },
  ];

  return <Table columns={columns} dataSource={products} rowKey="id" />;
};

export default ProductTable;
