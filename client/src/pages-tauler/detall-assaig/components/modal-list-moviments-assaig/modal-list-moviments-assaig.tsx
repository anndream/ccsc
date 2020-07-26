import { Moviment } from "model";
import React, { useContext } from "react";
import { ModalButtonBaseProps } from "../../../../components/modal-button/modal-button";
import { ModalSeleccionarMoviment } from "../../../../components/modal-seleccionar-moviment";
import { usePostAPI } from "../../../../helpers";
import { AssaigContext } from "../../detall-assaig";

interface ModalListMovimentsAssaigProps extends ModalButtonBaseProps {
  movimentsAssaig: Moviment[];
  getMovimentsAssaig: Function;
}

const ModalListMovimentsAssaig: React.FC<ModalListMovimentsAssaigProps> = ({
  movimentsAssaig,
  getMovimentsAssaig,
  ...rest
}) => {
  const { id_assaig } = useContext(AssaigContext);

  const [loadingPostMoviment, postMoviment] = usePostAPI<{
    id_moviment: number;
  }>(`/assajos/${id_assaig}/moviments`);

  return (
    <ModalSeleccionarMoviment
      dataFilter={(moviment) =>
        !movimentsAssaig
          .map((moviment) => moviment.id_moviment)
          .includes(moviment.id_moviment)
      }
      loading={loadingPostMoviment}
      onItemClick={postMoviment}
      thenAction={getMovimentsAssaig}
      {...rest}
    />
  );
};

export default ModalListMovimentsAssaig;
