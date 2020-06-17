import { Layout, Menu, PageHeader, Space, Spin } from "antd";
import React, { useContext, useEffect } from "react";
import { Link, Route, Switch, useHistory, useParams } from "react-router-dom";
import { SiderSetCollapsedContext } from "../../components/tauler-app/contexts/sider-context";
import { ColorCard } from "../../standalone/color-card";
import { AssajosProjectes } from "./components/assajos-projectes";
import "./detall-projecte.css";
import { useProjecte } from "./hooks";

export default ({ match }) => {
  const setCollapsed = useContext(SiderSetCollapsedContext);

  const history = useHistory();
  const { id } = useParams();

  const [projecte, loading] = useProjecte(id);

  useEffect(() => setCollapsed(true), [setCollapsed]);

  return (
    <Layout className="layout-projecte">
      <Spin spinning={loading}>
        <PageHeader
          ghost={false}
          title={
            <Space size="middle">
              <ColorCard hoverable={false} color={"#" + projecte.color} />
              {projecte.titol}
            </Space>
          }
          onBack={() => history.goBack()}
        />
      </Spin>
      <Layout>
        <Layout.Sider className="layout-projecte-sider">
          <Menu>
            <Menu.Item>
              <Link to={`${match.url}/assajos`}>Assajos</Link>
            </Menu.Item>
            <Menu.Item>
              <Link to={`${match.url}/obres`}>Obres</Link>
            </Menu.Item>
            <Menu.Item>
              <Link to={`${match.url}/concerts`}>Concerts</Link>
            </Menu.Item>
            <Menu.Item>
              <Link to={`${match.url}/participants`}>Participants</Link>
            </Menu.Item>
          </Menu>
        </Layout.Sider>
        <Layout.Content>
          <Switch>
            <Route path={`${match.url}/assajos`} component={AssajosProjectes} />
          </Switch>
        </Layout.Content>
      </Layout>
    </Layout>
  );
};
