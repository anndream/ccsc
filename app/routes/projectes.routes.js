const authJWT = require("../middleware/auth-jwt");
const controller = require("../controllers/projectes.controller");

module.exports = (app) => {
  app.get(
    "/api/projectes/count",
    [authJWT.verifyAccessToken],
    controller.projectes_count
  );

  app.get(
    "/api/projectes/historial",
    [authJWT.verifyAccessToken],
    controller.projectes_historial
  );
};
