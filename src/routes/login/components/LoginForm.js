import React from "react";
import { Form, Icon, Input, Button, message } from 'antd';
import Style from "./LoginForm.less";
import {inject, observer} from 'mobx-react';
import {withRouter} from "react-router-dom";

const FormItem = Form.Item;

@inject("user")
@observer
class LoginForm extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.user.signin(values).then(()=>{
          message.success("登录成功");
          this.props.history.push("/project")
        })
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={Style.wrapper}>
        <Form onSubmit={this.handleSubmit} className={Style.from}>
          <FormItem>
            {getFieldDecorator('phone', {
              rules: [{ required: true, message: '请输入手机号' }],
            })(
              <Input  size="large" prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="手机号" />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入密码' }],
            })(
              <Input size="large" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
            )}
          </FormItem>
          <FormItem>
            <Button  style={{width:"100%"}} size="large" type="primary" htmlType="submit" className={Style.submit}>
              登录
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(LoginForm);

export default withRouter(WrappedNormalLoginForm);
