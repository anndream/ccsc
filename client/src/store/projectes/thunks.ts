import { Projecte, ResponseError, Usuari } from "common";
import { fetchAPI } from "../../helpers";
import { AppThunk } from "../index";
import {
  fetchProjectesFailure,
  fetchProjectesRequest,
  fetchProjectesSuccess,
} from "./actions";

export const fetchProjectes = (): AppThunk => (dispatch, getState) => {
  const { id_persona } = getState().user.currentUser as Usuari;

  dispatch(fetchProjectesRequest());

  fetchAPI(
    `/socis/${id_persona}/projectes`,
    (data: Projecte[] | ResponseError) => {
      if (data.hasOwnProperty("error"))
        dispatch(fetchProjectesFailure((data as ResponseError).error));
      else dispatch(fetchProjectesSuccess(data as Projecte[]));
    },
    dispatch
  );
};