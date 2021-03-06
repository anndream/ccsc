import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  GiftTwoTone,
  QuestionCircleTwoTone,
  WarningTwoTone,
} from "@ant-design/icons";
import { Tooltip } from "antd";
import React, { cloneElement } from "react";
import { StyledComponent } from "react-types";

interface StatusIconProps extends StyledComponent {
  tooltip?: string;
  size?: "middle" | "large";
  statusId?: number;
  esAniversari?: boolean;
  label?: React.ReactNode;
}

const StatusIcon: React.FC<StatusIconProps> = ({
  tooltip,
  size = "middle",
  statusId,
  esAniversari = false,
  label,
  style,
}) => {
  const status = [
    <CheckCircleTwoTone key="check" twoToneColor="#52c41a" />,
    <QuestionCircleTwoTone key="question" twoToneColor="#1890ff" />,
    <CloseCircleTwoTone key="close" twoToneColor="#ff4d4f" />,
    <WarningTwoTone key="warning" twoToneColor="#faad14" />,
  ];

  const newStyle = {
    transform: size === "large" ? "scale(1.5) translate(3px)" : "",
    ...style,
  };

  return (
    <Tooltip title={tooltip}>
      <>
        {esAniversari ? (
          <GiftTwoTone twoToneColor="#eb2f96" style={newStyle} />
        ) : (
          statusId && cloneElement(status[statusId - 1], { style: newStyle })
        )}
        {label && <span style={{ marginLeft: ".5rem" }}>{label}</span>}
      </>
    </Tooltip>
  );
};

export default StatusIcon;
