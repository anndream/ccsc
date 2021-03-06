import { Usuari } from "model";
import {
  LOGOUT_USER,
  REMOVE_ACCEPTANCE_NOTICE,
  SIGNIN_USER_FAILURE,
  SIGNIN_USER_SUCCESS,
  UserActionTypes,
  UserState,
  VALIDATED_IN_WAITING_LIST,
} from "./types";

const initialState: UserState = {
  currentUser: {} as Usuari,
  error: {},
  waitingList: {
    inWaitingList: false,
    email: "",
  },
};

export default (state = initialState, action: UserActionTypes): UserState => {
  switch (action.type) {
    case SIGNIN_USER_SUCCESS:
      return {
        currentUser: action.payload,
        error: {},
        waitingList: { inWaitingList: true, email: "" },
      };

    case SIGNIN_USER_FAILURE:
      return {
        ...state,
        currentUser: {} as Usuari,
        error: action.payload,
      };

    case VALIDATED_IN_WAITING_LIST:
      return {
        ...state,
        waitingList: { inWaitingList: true, email: action.payload },
      };

    case REMOVE_ACCEPTANCE_NOTICE:
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          avisos: state.currentUser.avisos.filter(
            (avis) => avis !== action.payload
          ),
        },
      };

    case LOGOUT_USER:
      return {
        currentUser: {} as Usuari,
        error: {},
        waitingList: {},
      };

    default:
      return state;
  }
};
