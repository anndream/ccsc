import { Tabs } from "antd";
import React, { createContext, useContext, useEffect } from "react";
import Sticky from "react-stickynode";
import { IconAgrupacio } from "../../assets/icons";
import { SetPageHeaderContext } from "../../components/tauler-app/components/site-layout/site-layout";
import { ContentHeader } from "../../standalone/content-header";
import { AgrupacioPropTypes } from "../../typedef/prop-types";
import "./agrupacio.css";
import { CalendariAgrupacio } from "../../components/calendari-agrupacio";
import { ResumAgrupacio } from "./components/resum-agrupacio";

export const AgrupacioContext = createContext({});

const { TabPane } = Tabs;

const Agrupacio = ({ agrupacio }) => {
  const setPageHeader = useContext(SetPageHeaderContext);

  useEffect(() => {
    setPageHeader(agrupacio.nom);
  }, [setPageHeader, agrupacio.nom]);

  return (
    <AgrupacioContext.Provider value={agrupacio}>
      <ContentHeader
        title={agrupacio.nom}
        subtitle={agrupacio.descripcio}
        icon={<IconAgrupacio name={agrupacio.nom_curt} />}
        footer={
          <div className="tabs-agrupacio">
            <Tabs
              renderTabBar={(props, DefaultTabBar) => (
                <Sticky top={64} bottomOffset={80} innerZ={5}>
                  <DefaultTabBar {...props} />
                </Sticky>
              )}
            >
              <TabPane tab="Resum" key="resum">
                <ResumAgrupacio />
              </TabPane>
              <TabPane
                tab="Calendari"
                key="calendar"
                style={{ backgroundColor: "var(--background-color)" }}
              >
                <CalendariAgrupacio />
              </TabPane>
              <TabPane tab="Projectes" key="projectes" />
              <TabPane tab="Integrants" key="integrants" />
            </Tabs>
          </div>
        }
      />
    </AgrupacioContext.Provider>
  );
};

Agrupacio.propTypes = {
  agrupacio: AgrupacioPropTypes.isRequired,
};

export default Agrupacio;
