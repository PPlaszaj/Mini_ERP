import { Button, Form, Input, Modal, DatePicker } from "antd";
import { useState } from "react";
import supabase from "../services/supabase";
import Orders from "./Orders";

const CollectionCreateForm = ({ open, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  const [deadline, setDeadline] = useState(""); // Stan przechowujący wartość deadline jako string

  const handleDatePickerChange = (date, dateString) => {
    setDeadline(dateString); // Aktualizacja stanu z wartością jako string
  };

  return (
    <Modal
      open={open}
      title="Create a new Order"
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate({ ...values, deadline });
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          })
          .fetchOrders();
      }}
    >
      <Form form={form} layout="vertical" name="form_in_modal">
        <Form.Item
          name="orderNumber"
          label="Order Number"
          rules={[
            {
              required: true,
              message: "Please input the order number!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
              message: "Please input the order Name!",
            },
          ]}
          name="orderName"
          label="Order Name"
        >
          <Input type="textarea" />
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
              message: "Please input the data!",
            },
          ]}
          name="deadline"
          label="Deadline"
        >
          <DatePicker format={"YYYY-MM-DD"} onChange={handleDatePickerChange} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const OrdersModal = () => {
  const [open, setOpen] = useState(false);
  const onCreate = async (values) => {
    setOpen(false);

    const { data, error } = await supabase.from("Orders").insert([
      {
        order_number: values.orderNumber,
        order_name: values.orderName,
        deadline: values.deadline,
      },
    ]);
    if (!error) {
      console.log(data);
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
        New Order
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

export default OrdersModal;
