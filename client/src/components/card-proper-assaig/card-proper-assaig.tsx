import {
  InfoCircleOutlined,
  LayoutOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import { Card, Space, Tag, Typography } from "antd";
import { FixedTagsProjectes } from "components/fixed-tags-projectes";
import { IconsFormacions } from "components/icons-formacions";
import { Assaig } from "model";
import dayjs from "dayjs";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { CalendarAvatar } from "standalone/calendar-avatar";
import { EventLineItem } from "standalone/event-line-item";
import { StatusIcon } from "standalone/status-icon";
import { dateRange, useTimeRange } from "utils/datetime";
import { joinElements } from "utils/lists";
import { linkText } from "utils/strings";

interface CardProperAssaigProps {
  assaig: Assaig;
}

const CardProperAssaig: React.FC<CardProperAssaigProps> = ({ assaig }) => {
  const { t } = useTranslation("dashboard");

  const timeRange = useTimeRange();

  return (
    <Card
      title={
        <Space>
          <CalendarAvatar dayjs={dayjs(assaig.datahora_inici)} />
          {assaig.titol}
          <StatusIcon
            tooltip={assaig.estat_esdeveniment}
            statusId={assaig.id_estat_esdeveniment}
          />
          <Typography.Text type="secondary" style={{ fontWeight: "normal" }}>
            {timeRange(assaig.hora_inici, assaig.hora_final)}
          </Typography.Text>
        </Space>
      }
    >
      <Space direction="vertical">
        <EventLineItem>
          {joinElements(
            dateRange(
              assaig.data,
              assaig.hora_inici,
              assaig.data,
              assaig.hora_final,
              { separator: t("common:of connector") }
            ),
            (item, index) => (
              <span key={index}>{item}</span>
            ),
            (key) => (
              <span key={key} style={{ padding: "0 .25rem" }}>
                ·
              </span>
            )
          )}
        </EventLineItem>
        <EventLineItem icon={<LayoutOutlined />}>
          <Space>
            <FixedTagsProjectes projectes={assaig.projectes} />
            <IconsFormacions formacions={assaig.formacions} />
          </Space>
        </EventLineItem>
        {assaig.moviments && assaig.moviments.length > 0 && (
          <EventLineItem icon={<ReadOutlined />}>
            {assaig.moviments.map((moviment) => (
              <Tag key={moviment.id_moviment}>
                <Link
                  to={`/${linkText(t("works"))}/${moviment.id_obra}/${linkText(
                    t("movements")
                  )}/${moviment.id_moviment}`}
                >
                  {!moviment.es_unic_moviment && (
                    <b style={{ marginRight: 4 }}>{moviment.ordre}</b>
                  )}
                  {moviment.titol_moviment}
                </Link>
              </Tag>
            ))}
          </EventLineItem>
        )}
        <EventLineItem icon={<InfoCircleOutlined />}>
          <Link to={`/${linkText(t("rehearsals"))}/${assaig.id_assaig}`}>
            {t("common:more details")}
          </Link>
        </EventLineItem>
      </Space>
    </Card>
  );
};

export default CardProperAssaig;
