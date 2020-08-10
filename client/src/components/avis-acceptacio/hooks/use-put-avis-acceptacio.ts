import { BooleanMap } from "common";
import { useCallback, useState } from "react";
import { useFetchAPI } from "../../../helpers";

export default (idSoci: number) => {
  const fetchAPI = useFetchAPI();

  const [loading, setLoading] = useState(false);

  const putAvisAcceptacio = useCallback(
    <T = BooleanMap>(acceptacions: T, callback: (accepta: T) => void) => {
      setLoading(true);

      return fetchAPI<T>(
        `/socis/${idSoci}/acceptacions`,
        (accepta) => callback(accepta as T),
        { method: "PUT", body: JSON.stringify(acceptacions) }
      ).finally(() => setLoading(false));
    },
    [fetchAPI, idSoci]
  );

  return [putAvisAcceptacio, loading] as const;
};
