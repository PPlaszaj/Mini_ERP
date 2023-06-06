import { Button, Form, Input, Modal, DatePicker, InputNumber } from "antd";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import supabase from "../services/supabase";
import { PlusOutlined } from "@ant-design/icons";

const CollectionCreateForm = ({ open, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  const [deliveryDate, setDeliveryDate] = useState(""); // Stan przechowujący wartość deliveryDate jako string

  const handleDatePickerChange = (date, dateString) => {
    setDeliveryDate(dateString); // Aktualizacja stanu z wartością jako string
  };

  return (
    <Modal
      open={open}
      title="Add Product"
      okText="Add"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate({ ...values, deliveryDate });
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Form form={form} layout="vertical" name="form_in_modal">
        <Form.Item
          style={{
            marginTop: 30,
          }}
          name="productName"
          label="Product name:"
          rules={[
            {
              required: true,
              message: "Please input the product name!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="category" label="Category:">
          <Input />
        </Form.Item>
        <Form.Item name="index" label="Product index:">
          <InputNumber
            minLength={5}
            maxLength={10}
            style={{
              width: 200,
            }}
          />
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
              message: "Please input ammount of pruducts!",
            },
          ]}
          name="quantity"
          label="Quantity:"
        >
          <InputNumber min={1} max={1000} addonAfter="pcs." />
        </Form.Item>
        <Form.Item name="deliveryDate" label="Planned delivery date:">
          <DatePicker format={"YYYY-MM-DD"} onChange={handleDatePickerChange} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
const ProductModal = () => {
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    getOrder();
  }, []);

  //łapanie danych z Ordersów za pomocą useParams

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

  const onCreate = async (values) => {
    setOpen(false);

    const { error } = await supabase.from("Products").insert([
      {
        product_name: values.productName,
        index: values.index,
        delivery_date: values.deliveryDate,
        quantity: values.quantity,
        category: values.category,
        order_number: data[0].order_number,
      },
    ]);

    if (!error) {
    }
  };

  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setOpen(true);
        }}
      >
        <PlusOutlined />
        Add Product
      </Button>
      <CollectionCreateForm
        open={open}
        onCreate={onCreate}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </div>
  );
};

export default ProductModal;
