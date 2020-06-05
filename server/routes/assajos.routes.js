const authJWT = require("../middleware/auth-jwt");
const controller = require("../controllers/assajos.controller");

module.exports = (app) => {
  app.get(
    "/api/assajos/count",
    [authJWT.verifyAccessToken],
    controller.assajos_count
  );

  app.get(
    "/api/assajos/historial",
    [authJWT.verifyAccessToken],
    controller.assajos_historial
  );

  app.get(
    "/api/assajos/:id",
    [authJWT.verifyAccessToken],
    controller.assajos_detall
  );

  app.post(
    "/api/assajos",
    [authJWT.verifyAccessToken, authJWT.isJuntaDirectiva],
    controller.assajos_post
  );

  app.delete(
    "/api/assajos/:id",
    [authJWT.verifyAccessToken, authJWT.isJuntaDirectiva],
    controller.assajos_delete
  );

  app.get(
    "/api/assajos/:id/convocats",
    [authJWT.verifyAccessToken],
    controller.assajos_detall_convocats
  )
};
