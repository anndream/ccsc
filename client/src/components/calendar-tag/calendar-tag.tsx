import { Popover, Tag } from "antd";
import { CalendarEventPopover } from "components/calendar-event-popover";
import { TipusEsdeveniment } from "model";
import dayjs from "dayjs";
import React, { useState } from "react";
import { StatusIcon } from "standalone/status-icon";
import "./calendar-tag.css";

interface CalendarTagProps {
  childKey: number | string;
  esdeveniment: TipusEsdeveniment;
}

const CalendarTag: React.FC<CalendarTagProps> = ({
  childKey,
  esdeveniment,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <Popover
      visible={visible}
      content={<CalendarEventPopover esdeveniment={esdeveniment} />}
      trigger="click"
      onVisibleChange={setVisible}
      style={{ width: 600 }}
    >
      <Tag
        className="calendar-tag"
        key={childKey}
        style={{
          opacity: dayjs().isAfter(dayjs(esdeveniment.datahora_inici)) ? 0.6 : 1,
        }}
      >
        <StatusIcon
          tooltip={esdeveniment.estat_esdeveniment}
          esAniversari={esdeveniment.tipus === "aniversari"}
          statusId={esdeveniment.id_estat_esdeveniment}
          style={{ marginRight: "0.2rem" }}
        />
        {esdeveniment.hora_inici && (
          <span className="calendar-tag-time">
            {dayjs(esdeveniment.hora_inici, "HH:mm:ss").format("LT")}
          </span>
        )}
        <span className="calendar-tag-title">{esdeveniment.titol}</span>
      </Tag>
    </Popover>
  );
};

export default CalendarTag;
