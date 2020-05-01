import React from "react";
import { Form, Input, Typography } from "antd";
import { PageSkeleton } from "../../components/page-skeleton";

const { Paragraph } = Typography;

export default () => (
  <PageSkeleton title="Contacte">
    <Paragraph>
      Vols contactar amb nosaltres? Creus que t’avens amb el Cor de Cambra Sant
      Cugat? Vols mantenir-te informat sobre les nostres actuacions? T’agradaria
      deixar-nos algun comentari?
    </Paragraph>
    <Paragraph>Endavant! T’estarem agraïts!</Paragraph>
    <Form layout="vertical">
      <Form.Item
        label="Nom"
        name="nom"
        rules={[
          { required: true, message: "Si us plau, introdueixi el seu nom." },
        ]}
      >
        <Input autoFocus />
      </Form.Item>
      <Form.Item
        label="Adreça electrònica"
        name="email"
        rules={[
          {
            required: true,
            message:
              "Si us plau, introdueixi la seva adreça electrònica de contacte.",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Missatge"
        name="missatge"
        rules={[
          {
            required: true,
            message: "Si us plau, introdueixi el seu missatge.",
          },
        ]}
      >
        <Input />
      </Form.Item>
    </Form>
    <Paragraph>
      Si ho prefereixes, pots contactar amb nosaltres, també, amb el correu
      electrònic{" "}
      <a href="mailto:info@cordecambrasantcugat.cat">
        info@cordecambrasantcugat.cat
      </a>{" "}
      o mitjançant les xarxes socials.
    </Paragraph>
  </PageSkeleton>
);
