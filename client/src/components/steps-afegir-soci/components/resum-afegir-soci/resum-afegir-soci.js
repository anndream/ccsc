import { Descriptions, Space, Spin } from "antd";
import PropTypes from "prop-types";
import React from "react";
import { InfoCard } from "../../../../standalone/info-card";

const ResumAfegirSoci = ({ form, username, loadingUsername }) => {
  const data = form.getFieldsValue();

  return (
    <Space direction="vertical">
      <InfoCard title="Dades personals" disabled showArrow={false}>
        <Descriptions size="small">
          <Descriptions.Item label="Nom">{`${data.nom} ${data.cognoms}`}</Descriptions.Item>
          <Descriptions.Item label="Usuari">
            {loadingUsername ? <Spin size="small" /> : username}
          </Descriptions.Item>
          <Descriptions.Item label="DNI">{data.dni}</Descriptions.Item>
          <Descriptions.Item label="Naixement" span={2}>
            {data.naixement && data.naixement.format("LL")}
          </Descriptions.Item>
        </Descriptions>
      </InfoCard>
      {(data.experiencia_musical ||
        data.estudis_musicals ||
        data.data_alta) && (
        <InfoCard title="Informació musical" disabled showArrow={false}>
          <Descriptions size="small">
            {data.experiencia_musical && (
              <Descriptions.Item label="Experiència musical" span={3}>
                {data.experiencia_musical}
              </Descriptions.Item>
            )}
            {data.estudis_musicals && (
              <Descriptions.Item label="Estudis musicals" span={3}>
                {data.estudis_musicals}
              </Descriptions.Item>
            )}
            {data.data_alta && (
              <Descriptions.Item label="Data d’alta">
                {data.data_alta.format("LL")}
              </Descriptions.Item>
            )}
          </Descriptions>
        </InfoCard>
      )}
      <InfoCard title="Dades de contacte" disabled showArrow={false}>
        <Descriptions size="small">
          <Descriptions.Item label="Adreça electrònica" span={2}>
            {data.email}
          </Descriptions.Item>
          {data.telefon && (
            <Descriptions.Item label="Telèfon">
              {data.telefon}
            </Descriptions.Item>
          )}
        </Descriptions>
      </InfoCard>
    </Space>
  );
};

ResumAfegirSoci.propTypes = {
  form: PropTypes.any.isRequired,
  username: PropTypes.string.isRequired,
  loadingUsername: PropTypes.bool,
};

ResumAfegirSoci.defaultProps = {
  loadingUsername: false,
};

export default ResumAfegirSoci;
