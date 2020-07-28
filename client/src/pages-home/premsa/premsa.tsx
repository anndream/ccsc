import React from "react";
import { useTranslation } from "react-i18next";
import { PageSkeleton } from "../../components/home-app/components/page-skeleton";

const Premsa: React.FC = () => {
  const { t } = useTranslation("home");

  return <PageSkeleton title={t("press title")} />;
};

export default Premsa;
