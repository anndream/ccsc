import React, { useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { signinUserFetch } from "../../redux";
import { Button, Form, Input, message } from "antd";
import { LeftOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { Container } from "../../standalone/container";
import { LogoCorDeCambra } from "../../icons";
import { useIniciUsuari } from "./hooks";

import "./inicia-sessio.css";
import { useSelector } from "react-redux";

export default () => {
  const [loading, dispatch] = useIniciUsuari();
  const error = useSelector((state) => state.user.error);

  const onFinish = useCallback(
    (values) => {
      dispatch(signinUserFetch(values));
    },
    [dispatch]
  );

  useEffect(() => {
    if (error.statusCode >= 500) message.error(error.message);
    if (error.statusCode >= 400) message.warning(error.message);
  }, [error]);

  return (
    !loading && (
      <Container className="signin-container">
        <div className="signin-form-wrapper">
          <Link to="/">
            <Button
              className="signin-form-back-button"
              type="link"
              icon={<LeftOutlined />}
            >
              Inici
            </Button>
          </Link>
          <LogoCorDeCambra
            className="signin-logo"
            style={{ color: "var(--primary-color)" }}
          />
          <Form className="signin-form" onFinish={onFinish}>
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "Si us plau, introdueix el nom d’usuari.",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Nom d’usuari"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Si us plau, introdueix la contrasenya.",
                },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Contrasenya"
              />
            </Form.Item>
            <Form.Item>
              <a className="signin-form-forgot" href="#">
                Has oblidat la contrasenya?
              </a>
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                className="signin-form-button"
              >
                Inicia sessió
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Container>
    )
  );
};
