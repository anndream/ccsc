import {
  BookOutlined,
  InfoCircleOutlined,
  LayoutOutlined,
} from "@ant-design/icons";
import { Card, Space, Tag, Typography } from "antd";
import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";
import { joinComponents } from "../../helpers";
import { CalendarAvatar } from "../../standalone/calendar-avatar";
import { EventLineItem } from "../../standalone/event-line-item";
import { StatusIcon } from "../../standalone/status-icon";
import { AssaigPropTypes } from "../../typedef/prop-types";
import { dateRange, timeRange } from "../../utils";
import { FixedTagsProjectes } from "../fixed-tags-projectes";
import { IconsFormacions } from "../icons-formacions";

const CardProperAssaig = ({ assaig }) => (
  <Card
    title={
      <Space>
        <CalendarAvatar moment={moment(assaig.data_inici)} />
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
        {joinComponents(
          dateRange(
            assaig.dia_inici,
            assaig.hora_inici,
            assaig.dia_final,
            assaig.hora_final
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
        <EventLineItem icon={<BookOutlined />}>
          {assaig.moviments.map((moviment) => (
            <Tag key={moviment.id_moviment}>{moviment.titol_moviment}</Tag>
          ))}
        </EventLineItem>
      )}
      <EventLineItem icon={<InfoCircleOutlined />}>
        <Link to={`/assajos/${assaig.id_assaig}`}>Més detalls</Link>
      </EventLineItem>
    </Space>
  </Card>
);

CardProperAssaig.propTypes = {
  assaig: AssaigPropTypes.isRequired,
};

export default CardProperAssaig;