import React, { useState } from 'react'
import {Button, Col, Divider, Form, Input, Modal, Row, Select, Table} from "antd";
import {UserOutlined ,DeleteOutlined,EditOutlined,BoxPlotOutlined} from "@ant-design/icons";
import "./Team.scss";
import Search from 'antd/es/transfer/search';
import Title from 'antd/es/typography/Title';

const Team = () => {

    const columns = [
        {
                title: "Sr. No",
                dataIndex: "srno",
                width: "5%"
        },
        {
          title: "Team Name",
          dataIndex: "teamname",
          width: "30%"
        },
        {
          title: "Department",
          dataIndex: "department",
          width: "22%"
        },
        {
          title: "Team Leader",
          dataIndex: "teamleader",
          width: "22%"
        },
        {
          title: "Team Members",
          dataIndex: "teammembers",
          width: "20%",
        },
        {
          title: "Action",
          dataIndex: "action",
          width: "11%",
        }
      ];
      
      const data = [
            {
              srno:<div className='t4'>1.</div>,
              teamname:<div className='t4'>Account Team A</div>,
              department:<div className='t4'>Accounting</div>,
              teamleader:<div className='t4'>Hitesh Soni</div>,
              teammembers:<div className='t4'><img src={require("./Image/dd2.jpg")} className='t5' />&nbsp;&nbsp;05</div>,
              action:<div className='t4'><EditOutlined />&nbsp;<DeleteOutlined /></div>,
            }
      ];
      const [isModalOpen, setIsModalOpen] = useState(false);
    
        const showModal = () => {
            setIsModalOpen(true);
        };
        
        const handleCancel = () => {
          //form.resetFields();
          setIsModalOpen(false);
      };
      const handleOk = () => {
        //form.resetFields();
        setIsModalOpen(false);
    };
    
  return (
    <div>
      <Row gutter={[8, 8]} className="form-row">
                    <Col xs={{ span: 24 }} sm={{ span: 16 }} md={{ span: 4 }}>
                        <Title level={4}>Teams</Title>
                    </Col>
                    <Col
                        xs={{ span: 24 }}
                        sm={{ span: 16 }}
                        md={{ span: 18 }}
                    ></Col>
                    <Col xs={{ span: 24 }} sm={{ span: 16 }} md={{ span: 2 }}>
                    <Button 
                    type='primary' 
                    className='t2'
                    onClick={showModal}
                    style={{ float: "right", marginBottom: "10px" }}>Create New</Button>
                    </Col>
            </Row>
            <hr className='t8'/>
        <div className='t3'>
            <Search placeholder='Search ...' />
        </div>
        <br />
        <div>
          <Table
            className='t4'
            columns={columns}
            dataSource={data}   
          />
          
        </div>
        <Modal
                title="Create New Team" 
                open={isModalOpen}
                onCancel={handleCancel}
                onOk={handleOk}
                width={350}
            >
              <hr />                
              <Form>
                    <Row gutter={[8, 8]} className="form-row">
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 16 }}
                            md={{ span: 24 }}
                        >
                          <div>
                            <p className='t6'>Team Name</p>
                            <Input
                                    placeholder="Team Name"
                                    className="t7"  
                                />
                            <p className='t6'>Department</p> 
                            <Input
                                    placeholder="Department"
                                    className="t7"
                                /> 
                                <p className='t6'>Team Leader</p> 
                            <Input
                                    placeholder="Team Leader"
                                    className="t7"
                                /> 
                                <p className='t6'>Team Member</p> 
                            <Input
                                    placeholder="Team Member"
                                    className="t7"
                                />   
                                </div>
                                
                        </Col>
                    </Row>
                    <Row gutter={[8, 8]} className="">
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 24 }}
                            md={{ span: 24 }}
                        >
                            
                        </Col>
                    </Row>
                </Form>
            </Modal>
    </div>
  )
}

export default Team
