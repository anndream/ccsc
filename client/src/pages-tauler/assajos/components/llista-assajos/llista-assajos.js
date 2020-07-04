import { List } from "antd";
import moment from "moment";
import PropTypes from "prop-types";
import React, { useCallback, useContext } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Authorized } from "../../../../components/authorized";
import { FixedTagsProjectes } from "../../../../components/fixed-tags-projectes";
import { IconsFormacions } from "../../../../components/icons-formacions";
import { FormacionsListContext } from "../../../../components/tauler-app/contexts/formacions-context";
import { useDeleteAPI } from "../../../../helpers";
import { searchFilterAssaig } from "../../../../helpers/search-filters";
import { fetchAssajos } from "../../../../redux/assajos/assajos-actions";
import { CalendarAvatar } from "../../../../standalone/calendar-avatar";
import { DropdownBorderlessButton } from "../../../../standalone/dropdown-borderless-button";
import { searchFilter, timeRange } from "../../../../utils";
import { useAssajos } from "./hooks";

const { Item } = List;

const LlistaAssajos = ({ idProjecte, searchValue, anteriors = false }) => {
  const dispatch = useDispatch();

  const formacions = useContext(FormacionsListContext);

  const [assajos, loading] = useAssajos();
  const [loadingDelete, showDeleteConfirm] = useDeleteAPI(
    "/api/assajos",
    "l’assaig",
    () => dispatch(fetchAssajos())
  );

  const getDataSource = useCallback(() => {
    let list = anteriors
      ? assajos
          .filter((assaig) =>
            moment(assaig.data_final || assaig.data_inici).isBefore(moment())
          )
          .sort((a, b) => moment(b.data_inici).diff(moment(a.data_inici)))
      : assajos.filter((assaig) =>
          moment().isSameOrBefore(
            moment(assaig.data_final || assaig.data_inici)
          )
        );

    if (idProjecte)
      list = list.filter((assaig) =>
        assaig.projectes.find(
          (projecte) => projecte.id_projecte === parseInt(idProjecte)
        )
      );

    return searchValue.length > 0
      ? list.filter((assaig) =>
          searchFilter(searchValue, searchFilterAssaig(assaig))
        )
      : list;
  }, [anteriors, assajos, idProjecte, searchValue]);

  return (
    <List
      dataSource={getDataSource()}
      loading={loading || loadingDelete}
      renderItem={(assaig) => (
        <Item
          key={assaig.id_assaig}
          actions={[
            ...(formacions.length > 1 &&
            assaig.formacions &&
            assaig.formacions.length > 0
              ? [<IconsFormacions formacions={assaig.formacions} />]
              : []),
            ...(assaig.projectes && assaig.projectes.length > 0
              ? [<FixedTagsProjectes projectes={assaig.projectes} />]
              : []),
            <Authorized>
              <DropdownBorderlessButton
                items={[
                  {
                    key: "eliminar",
                    action: "Eliminar",
                    danger: true,
                    onClick: () => showDeleteConfirm(assaig.id_assaig),
                  },
                ]}
              />
            </Authorized>,
          ]}
        >
          <Link to={`/assajos/${assaig.id_assaig}`}>
            <Item.Meta
              avatar={
                <CalendarAvatar
                  moment={moment(assaig.data_inici)}
                  style={{
                    transform: "scale(1.25)",
                    position: "relative",
                    top: 8,
                  }}
                />
              }
              title={assaig.titol}
              description={timeRange(assaig.hora_inici, assaig.hora_final, {
                textual: true,
              })}
              {...(anteriors && { style: { opacity: 0.6 } })}
            />
          </Link>
        </Item>
      )}
    />
  );
};

LlistaAssajos.propTypes = {
  idProjecte: PropTypes.any,
  searchValue: PropTypes.string.isRequired,
  anteriors: PropTypes.bool,
};

export default LlistaAssajos;
