import { Space } from "antd";
import { IconFormacio } from "assets/icons";
import { Formacio } from "model";
import React from "react";

interface IconsFormacionsProps {
  formacions: Formacio[];
}

const IconsFormacions: React.FC<IconsFormacionsProps> = ({
  formacions = [],
}) => (
  <Space>
    {formacions.map((formacio) => (
      <IconFormacio key={formacio.id_formacio} name={formacio.nom_curt} />
    ))}
  </Space>
);

export default IconsFormacions;
