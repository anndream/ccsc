import { PlusOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import { Authorized } from "components/authorized";
import { FixedTagsProjectes } from "components/fixed-tags-projectes";
import { useAPI } from "helpers";
import { Moviment } from "model";
import { ObraContext } from "pages/tauler/detall-obra";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { BorderlessButton } from "standalone/borderless-button";
import { ContentList } from "standalone/content-list";
import { DropdownBorderlessButton } from "standalone/dropdown-borderless-button";
import { timeDuration } from "utils/datetime";
import { ModalAfegirMoviment } from "../modal-afegir-moviment";

const ContentListMoviments: React.FC = () => {
  const { t } = useTranslation("dashboard");

  const { id_obra, durada_total } = useContext(ObraContext);

  const [moviments, loadingMoviments, getMoviments] = useAPI<Moviment[]>(
    `/obres/${id_obra}/moviments`,
    []
  );

  return (
    <ContentList
      title={t("movements")}
      loading={loadingMoviments}
      dataSource={moviments.map((moviment) => ({
        id: moviment.id_moviment,
        title: moviment.titol_moviment,
        link: `/obres/${moviment.id_obra}/moviments/${moviment.id_moviment}`,
        actions: [
          timeDuration(moviment.durada, {
            defaultText: t("common:no duration"),
          }),
          ...(moviment.projectes && moviment.projectes.length > 0
            ? [
                <FixedTagsProjectes
                  key="fixed-tags-projectes"
                  projectes={moviment.projectes}
                />,
              ]
            : []),
          <Authorized key="more_options">
            <DropdownBorderlessButton
              items={[
                {
                  key: t("common:delete"),
                  action: t("common:delete"),
                  danger: true,
                  onClick: undefined,
                },
              ]}
            />
          </Authorized>,
        ],
        avatar: (
          <Typography.Text type="secondary" style={{ fontSize: "small" }}>
            {moviment.ordre}
          </Typography.Text>
        ),
      }))}
      action={
        <ModalAfegirMoviment
          button={<BorderlessButton shape="circle" icon={<PlusOutlined />} />}
          getMoviments={getMoviments}
        />
      }
      extra={
        durada_total &&
        t("common:total items", {
          items: timeDuration(durada_total, {
            defaultText: t("common:no duration"),
          }),
        })
      }
    />
  );
};

export default ContentListMoviments;
