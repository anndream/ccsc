const express = require("express");
const authJWT = require("../middleware/auth-jwt");
const controller = require("../controllers/projectes.controller");

const router = express.Router();

router.route("/").post([authJWT.verifyAccessToken], controller.projectes_post);

router
  .route("/count")
  .get([authJWT.verifyAccessToken], controller.projectes_count);

router
  .route("/historial")
  .get([authJWT.verifyAccessToken], controller.projectes_historial);

router
  .route("/check-inicials/:inicials")
  .get([authJWT.verifyAccessToken], controller.projectes_checkinicials);

router
  .route("/:id")
  .get([authJWT.verifyAccessToken], controller.projectes_detall)
  .delete(
    [authJWT.verifyAccessToken, authJWT.isJuntaDirectiva],
    controller.projectes_delete
  );
};
