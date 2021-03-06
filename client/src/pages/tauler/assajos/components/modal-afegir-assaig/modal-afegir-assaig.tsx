import { Checkbox, Col, DatePicker, Form, Row, TimePicker } from "antd";
import { ModalButton, ModalButtonBaseProps } from "components/modal-button";
import { TagSelectFormItemFormacions } from "components/tag-select-form-item-formacions";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "store/types";
import { useAfegirAssaig } from "./hooks";

interface ModalAfegirAssaigProps extends ModalButtonBaseProps {
  idProjecte?: number;
}

const ModalAfegirAssaig: React.FC<ModalAfegirAssaigProps> = ({
  idProjecte,
  title,
  ...rest
}) => {
  const { t } = useTranslation(["validation", "fields"]);

  const { loading } = useSelector(({ assajos }: RootState) => assajos);

  const [form, handleOk] = useAfegirAssaig();

  return (
    <ModalButton
      title={title || t("actions:add rehearsal")}
      confirmLoading={loading}
      onOk={(setVisible) => {
        handleOk(idProjecte).then(() => {
          setVisible(false);
          form.resetFields();
        });
      }}
      renderModalBody={() => (
        <Form form={form} layout="vertical">
          <Row>
            <Col sm={24} md={8} flex={1}>
              <Form.Item
                name="data"
                label={t("fields:day")}
                rules={[{ required: true, message: t("enter day") }]}
              >
                <DatePicker format="L" />
              </Form.Item>
            </Col>
            <Col sm={24} md={16} flex={1}>
              <Form.Item name="hora" label={t("fields:time")}>
                <TimePicker.RangePicker
                  format="HH:mm"
                  minuteStep={5}
                  allowEmpty={[false, true]}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Item name="es_general" valuePropName="checked">
                <Checkbox>{t("fields:general")}</Checkbox>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name="es_extra" valuePropName="checked">
                <Checkbox>{t("fields:extra")}</Checkbox>
              </Form.Item>
            </Col>
          </Row>
          <TagSelectFormItemFormacions />
        </Form>
      )}
      {...rest}
    />
  );
};

export default ModalAfegirAssaig;
