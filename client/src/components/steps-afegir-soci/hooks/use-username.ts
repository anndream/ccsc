import { NomPila } from "model";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchAPI } from "../../../helpers";
import { generateUsername } from "../../../utils";

export default () => {
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [loadingUsername, setLoadingUsername] = useState(false);

  const getUsername = ({ nom, cognoms }: NomPila) => {
    setLoadingUsername(true);

    const username = generateUsername(nom, cognoms);

    fetchAPI<number>(
      `/usuaris/${username}/first-available-num`,
      (count) => {
        setUsername(`${username}${count > 0 ? count : ""}`);
        setLoadingUsername(false);
      },
      dispatch
    );
  };

  return [username, loadingUsername, getUsername] as const;
};