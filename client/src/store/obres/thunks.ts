import { ResponseError } from "common";
import { Obra } from "model";
import { baseFetchAPI } from "../../helpers/use-fetch-api";
import { AppThunkAction } from "../types";
import {
  fetchObresFailure,
  fetchObresRequest,
  fetchObresSuccess,
} from "./actions";

export const fetchObres = (): AppThunkAction => (dispatch) => {
  dispatch(fetchObresRequest());

  baseFetchAPI<Obra[]>(
    `/obres`,
    (data) => {
      if (data.hasOwnProperty("error"))
        dispatch(fetchObresFailure((data as ResponseError).error));
      else dispatch(fetchObresSuccess(data as Obra[]));
    },
    dispatch
  );
};
