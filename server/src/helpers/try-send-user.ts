import { NextFunction, Response } from "express";
import { Usuari } from "model";

export default (
  res: Response,
  next: NextFunction,
  user: Usuari,
  accessToken: string
) => {
  if (!user.es_actiu)
    return res.status(403).send({
      error: {
        status: 403,
        message: "inactive partner",
        description: "a member must subscribe you again",
        okText: "common:ok",
        okOnly: true,
        noAction: true,
      },
    });

  res.cookie("amcc_accesstoken", accessToken, {
    maxAge: 10800 * 1000,
    httpOnly: true,
    sameSite: true,
  });

  res.send(user);
};
