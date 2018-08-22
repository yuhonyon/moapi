import { Modal,Form, Input,Upload,Button,Icon } from 'antd';
import React from 'react'
import {inject, observer} from 'mobx-react';
import config from "@/config"
const FormItem=Form.Item;


const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};

@inject("interfases","user","project")
@observer
class ImportSwaggerModal extends React.Component {
  state={
    confirmLoading:false
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.visible&&nextProps.visible!==this.props.visible){
      this.props.form.setFieldsValue({
        url: nextProps.project.info.swaggerUrl,
      })
    }
  }

  handleOk = (e) => {
    this.props.form.validateFields((err, values) => {
      if (err) {
        return
      }
      this.setState({
        confirmLoading: true,
      });
      this.props.project.importSwagger(values).then(data=>{
        this.props.form.resetFields()
        this.props.onClose();
        this.setState({
          confirmLoading: false,
        });
      }).catch(e=>{
        this.setState({
          confirmLoading: false,
        });
      })
    });
  }
  handleCancel = (e) => {
    this.props.form.resetFields()
    this.props.onClose();
  }

  handleChange=()=>{

  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Modal maskClosable={false}
          width={640}
          title="导入Swagger"
          visible={this.props.visible}
          confirmLoading={this.state.confirmLoading}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText="同步"
        >
          <Form>
            <FormItem
              {...formItemLayout}
              label="在线swagger"
            >
              {getFieldDecorator('url', {
                initialValue:''
              })(
                <Input />
              )}
            </FormItem>


            <FormItem
              {...formItemLayout}
              label="本地swagger文件"
            >
              {getFieldDecorator('message', {
                initialValue: ''
              })(
                <Upload
                  showUploadList={false}
                  onChange={this.handleChange}
                  action={`${config.baseURL}doc/upload?token=${this.props.user.userInfo.accessToken}&projectId=${this.props.project.projectId}`}
                  >
                   <Button>
                     <Icon type="upload" /> 上传
                   </Button>
                 </Upload>
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(ImportSwaggerModal);
