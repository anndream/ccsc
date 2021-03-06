import { useAPI } from "helpers";
import { Entitat } from "model";
import React, { createContext } from "react";
import { useTranslation } from "react-i18next";
import { BrowserRouter } from "react-router-dom";
import { linkText } from "utils/strings";
import { MainLayout } from "./components/main-layout";
import { FormacionsContext, SiderContext } from "./contexts";

export const EntitatContext = createContext<Entitat>({} as Entitat);

const TaulerApp: React.FC = () => {
  const { t } = useTranslation("dashboard");

  const [entitat] = useAPI<Entitat>("/entitats/1", {} as Entitat);

  return (
    <EntitatContext.Provider value={entitat}>
      <FormacionsContext>
        <SiderContext>
          <BrowserRouter basename={`/${linkText(t("dashboard"))}`}>
            <MainLayout />
          </BrowserRouter>
        </SiderContext>
      </FormacionsContext>
    </EntitatContext.Provider>
  );
};

export default TaulerApp;
