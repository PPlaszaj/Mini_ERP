import { Layout, Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import supabase from "../services/supabase";
import {
  HomeFilled,
  LogoutOutlined,
  ShoppingCartOutlined,
  TagOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;
const SideBar = () => {
  const navigation = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    let { error } = await supabase.auth.signOut();

    if (!error) {
      navigation("/signin");
    }
  };

  return (
    <Sider breakpoint="lg" collapsedWidth="0" style={{ minHeight: "100vh" }}>
      <div className="demo-logo-vertical" />
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["4"]}
        selectedKeys={[location.pathname]}
        items={[
          {
            label: "Dashboard",
            key: "/",
            icon: <HomeFilled />,
            onClick: () => navigation("/"),
          },
          {
            label: "Orders",
            key: "/orders",
            icon: <ShoppingCartOutlined />,
            onClick: () => navigation("/orders"),
          },
          {
            label: "Products",
            key: "/products",
            icon: <TagOutlined />,
            onClick: () => navigation("/products"),
          },
          {
            label: "Signout",
            key: "/signout",
            danger: true,
            icon: <LogoutOutlined />,
            onClick: handleLogout,
          },
        ]}
      />
    </Sider>
  );
};

export default SideBar;
