import { PageHeader, Spin, Typography } from "antd";
import { SetPageHeaderContext } from "components/tauler-app/components/site-layout";
import { useAPI } from "helpers";
import { Moviment } from "model";
import React, { createContext, useContext, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Container } from "standalone/container";

const { Title } = Typography;

export const MovimentContext = createContext<Moviment>({} as Moviment);

const DetallMoviment: React.FC = () => {
  const setPageHeader = useContext(SetPageHeaderContext);

  const history = useHistory();
  const { moviment: idMoviment } = useParams<{ moviment?: string }>();

  const [moviment, loadingMoviment] = useAPI<Moviment>(
    `/moviments/${idMoviment}`,
    {} as Moviment
  );

  useEffect(() => {
    setPageHeader(moviment.titol_moviment);
  }, [setPageHeader, moviment.titol_moviment]);

  return (
    <MovimentContext.Provider value={moviment}>
      <>
        <PageHeader
          ghost={false}
          title={moviment.titol_moviment}
          onBack={() => history.goBack()}
        />
        <Spin spinning={loadingMoviment}>
          <Container>
            <Title level={2}>{moviment.titol_moviment}</Title>
            <Title level={4}>{moviment.titol_obra}</Title>
          </Container>
        </Spin>
      </>
    </MovimentContext.Provider>
  );
};

export default DetallMoviment;
