import React, { createContext, useContext, useState } from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import { Inici } from "../../../../domain-tauler/inici";
import { kebabCase } from "../../../../utils";
import { Agrupacio } from "../../../../domain-tauler/agrupacio";
import { Socis } from "../../../../domain-tauler/socis";
import { PerfilSoci } from "../../../../domain-tauler/socis/components/perfil-soci";
import { Layout, Typography } from "antd";

import {
  SiderBrokenContext,
  SiderCollapsedContext,
} from "../../contexts/sider-context";
import {
  AgrupacionsListContext,
  LoadingAgrupacionsContext,
} from "../../contexts/agrupacions-context";

import "./site-layout.css";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import { UserDropdown } from "../../../main-sider/components/user-sider-item";
import { Authorized } from "../../../authorized";

const { Content, Header } = Layout;
const { Title } = Typography;

export const SetPageHeaderContext = createContext((_) => {});

export default () => {
  const agrupacions = useContext(AgrupacionsListContext);
  const loadingAgrupacions = useContext(LoadingAgrupacionsContext);
  const collapsed = useContext(SiderCollapsedContext);
  const broken = useContext(SiderBrokenContext);

  const [scrolled, setScrolled] = useState(false);
  const [pageHeader, setPageHeader] = useState("");
  const location = useLocation();

  useScrollPosition(({ _, currPos }) => {
    if (currPos.y < -15) setScrolled(true);
    else setScrolled(false);
  });

  const startInset = broken ? 0 : collapsed ? 80 : 200;

  return (
    <SetPageHeaderContext.Provider value={setPageHeader}>
      <Layout className={"site-layout" + (scrolled ? " header-scrolled" : "")}>
        <Header
          className={
            "site-layout-background app-layout-header" +
            (location.pathname === "/" ? " ghost" : "")
          }
          style={{
            marginInlineStart: startInset,
            width: `calc(100% - ${startInset}px)`,
          }}
        >
          <Title className="app-layout-header-title" level={4}>
            {pageHeader}
          </Title>
          <UserDropdown />
        </Header>
        <Content
          className="app-layout-content site-layout-background"
          style={{ marginInlineStart: startInset }}
        >
          <Switch>
            <Route exact path="/" component={Inici} />
            {loadingAgrupacions
              ? ""
              : agrupacions.map((agrupacio) => (
                  <Route
                    key={agrupacio.id_agrupacio}
                    exact
                    path={"/" + kebabCase(agrupacio.nom_curt)}
                    render={(props) => (
                      <Agrupacio {...props} agrupacio={agrupacio} />
                    )}
                  />
                ))}
            <Authorized>
              <Route exact path="/socis" component={Socis} />
            </Authorized>
            <Route exact path="/socis/:id" component={PerfilSoci} />
          </Switch>
        </Content>
      </Layout>
    </SetPageHeaderContext.Provider>
  );
};
