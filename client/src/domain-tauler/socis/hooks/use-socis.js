import { useEffect, useState, useCallback } from "react";
import { fetchAPI } from "../../../helpers";
import { useDispatch } from "react-redux";

export default () => {
  const dispatch = useDispatch();
  const [socis, setSocis] = useState([]);
  const [loading, setLoading] = useState(false);

  const getSocis = useCallback(
    (next) => {
      setLoading(true);

      fetchAPI(
        "/api/socis",
        (data) => {
          setSocis(data);
          setLoading(false);
          if (typeof next === "function") next();
        },
        dispatch
      );
    },
    [dispatch]
  );

  useEffect(() => {
    getSocis();
  }, [getSocis]);

  return [socis, loading, getSocis];
};
