import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { NavLink, useNavigate } from "react-router-dom";
import { getAllUsers, deactivateUser } from "./AdminAPI";
import {
  PlusSquareOutlined,
  LockOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Button, Table, Modal } from "antd";

const renderAction = () => {
  return (
    <>
      <Button>
        <EditOutlined />
      </Button>
    </>
  );
};

const columns = [
  {
    title: "Email",
    dataIndex: "email",
  },
  {
    title: "Status",
    dataIndex: "status",
  },
  {
    title: "Date",
    dataIndex: "date",
  },
  {
    title: "Action",
    render: renderAction,
  },
];

const data = [];
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    email: `Edward King ${i}`,
    age: 32,
    address: `London, Park Lane no. ${i}`,
  });
}

const ManageStories = () => {
  const [users, setUsers] = useState([]);
  const { user } = useContext(UserContext);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDeactiveUser = (userId) => () => {
    deactivateUser(userId);
    navigate("/admin/manage-user");
  };

  const LoadListUser = () => {
    getAllUsers(token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        const transformedData = data.map((user) => ({
          key: user.id,
          email: user.email,
          status: user.active ? "Active" : "Deactive",
          date: user.date,
        }));
        setUsers(transformedData);
      }
    });
  };

  useEffect(() => {
    LoadListUser();
  }, []);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: "odd",
        text: "Select Odd Row",
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return false;
            }
            return true;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
      {
        key: "even",
        text: "Select Even Row",
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return true;
            }
            return false;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
    ],
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };

  return (
    <div style={{ textAlign: "left" }}>
      <h1>Manage Stories</h1>
      <Button
        style={{ height: "50px", width: "50px", borderRadius: "8px" }}
        onClick={() => setIsModalOpen(true)}
      >
        <PlusSquareOutlined />
      </Button>
      <h1> </h1>
      <Table rowSelection={rowSelection} columns={columns} dataSource={users} />
      <Modal
        title="Create New Stories"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </div>
  );
};

export default ManageStories;
