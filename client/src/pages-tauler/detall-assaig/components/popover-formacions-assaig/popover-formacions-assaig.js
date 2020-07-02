import PropTypes from "prop-types";
import React, { useCallback, useContext, useMemo } from "react";
import { IconsFormacions } from "../../../../components/icons-formacions";
import { PopoverList } from "../../../../components/popover-list";
import { useAPI } from "../../../../helpers";
import { BorderlessButton } from "../../../../standalone/borderless-button";
import { AssaigContext } from "../../detall-assaig";
import { useFormacioAssaig } from "./hooks";

const PopoverFormacionsAssaig = ({ getConvocatsAssaig }) => {
  const { id_assaig } = useContext(AssaigContext);

  const [formacions, loadingFormacions, getFormacions] = useAPI(
    `/api/assajos/${id_assaig}/formacions`
  );
  const [loadingFormacio, changeFormacioAssaig] = useFormacioAssaig(id_assaig);

  const formacionsFiltered = useMemo(
    () => formacions && formacions.filter(({ convocada }) => convocada),
    [formacions]
  );

  const formacionsElement = useCallback(
    (textualAction) => (
      <>
        <span style={{ marginRight: 8 }}>
          {formacionsFiltered.length > 0
            ? "Formacions"
            : `${textualAction} formacions`}
        </span>
        <IconsFormacions formacions={formacionsFiltered} />
      </>
    ),
    [formacionsFiltered]
  );

  return (
    <PopoverList
      title="Formacions convocades"
      searchPlaceholder="Cerca formacions"
      defaultValue={formacionsFiltered.map(({ id_formacio }) => id_formacio)}
      dataSource={formacions.map((formacio) => ({
        ...formacio,
        value: formacio.id_formacio,
        label: formacio.nom,
      }))}
      searchFilters={(formacio) => ({
        texts: [formacio.nom],
      })}
      loading={loadingFormacions || loadingFormacio}
      onChange={({ target }) => {
        changeFormacioAssaig({
          id_formacio: target.value,
          checked: target.checked,
        }).then(() => {
          getConvocatsAssaig();
          getFormacions();
        });
      }}
      action={
        <BorderlessButton>{formacionsElement("Afegeix")}</BorderlessButton>
      }
      elseElement={formacionsElement("Sense")}
      needsAuthorization
    />
  );
};

PopoverFormacionsAssaig.propTypes = {
  getConvocatsAssaig: PropTypes.func,
};

export default PopoverFormacionsAssaig;
