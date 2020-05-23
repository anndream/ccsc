exports.associacio_get = (req, res, next) => {
  const pool = req.app.get("pool");

  pool
    .query(
        `SELECT *
         FROM associacio;`
    )
    .then(([associacio]) => res.json(associacio))
    .catch((e) => next(e));
};

/** @deprecated */
exports.associacio_protecciodades = (req, res, next) => {
  const pool = req.app.get("pool");

  pool
    .query(
        `SELECT tipus_avisos.nom AS titol,
                avisos.descripcio,
                titol_acceptacions,
                requerit,
                data_inici,
                data_final,
                (
                    SELECT IFNULL(JSON_ARRAYAGG(
                                          JSON_OBJECT(
                                                  'id', id_seccio_avis,
                                                  'titol', titol,
                                                  'descripcio', descripcio
                                              )
                                      ), '[]')
                    FROM seccions_avis
                    WHERE id_avis = (SELECT avisos.id_avis)
                )                AS seccions,
                (
                    SELECT IFNULL(JSON_ARRAYAGG(
                                          JSON_OBJECT(
                                                  'titol', titol,
                                                  'descripcio', descripcio,
                                                  'requerida', requerida,
                                                  'form_name', form_name
                                              )
                                      ), '[]')
                    FROM acceptacions_avis
                    WHERE id_avis = (SELECT avisos.id_avis)
                )                AS acceptacions
         FROM avisos
                  INNER JOIN tipus_avisos USING (id_tipus_avis)
         WHERE id_tipus_avis = 1
           AND IFNULL(CURRENT_DATE >= data_inici, TRUE)
           AND IFNULL(CURRENT_DATE < data_final, TRUE)
         LIMIT 1;`
    )
    .then(([proteccioDades]) => {
      try {
        proteccioDades.seccions = JSON.parse(proteccioDades.seccions);
        proteccioDades.acceptacions = JSON.parse(proteccioDades.acceptacions);
      } catch (e) {
        next(e);
        return res.end();
      }

      res.json(proteccioDades);
    })
    .catch((e) => next(e));
};

exports.associacio_avisos = (req, res, next) => {
  const pool = req.app.get("pool");
  const id_tipus_avis = req.params.id;

  pool
    .query(
        `SELECT tipus_avisos.nom AS titol,
                avisos.descripcio,
                titol_acceptacions,
                requerit,
                data_inici,
                data_final,
                (
                    SELECT IFNULL(JSON_ARRAYAGG(
                                          JSON_OBJECT(
                                                  'id', id_seccio_avis,
                                                  'titol', titol,
                                                  'descripcio', descripcio
                                              )
                                      ), '[]')
                    FROM seccions_avis
                    WHERE id_avis = (SELECT avisos.id_avis)
                )                AS seccions,
                (
                    SELECT IFNULL(JSON_ARRAYAGG(
                                          JSON_OBJECT(
                                                  'titol', titol,
                                                  'descripcio', descripcio,
                                                  'requerida', requerida,
                                                  'form_name', form_name
                                              )
                                      ), '[]')
                    FROM acceptacions_avis
                    WHERE id_avis = (SELECT avisos.id_avis)
                )                AS acceptacions
         FROM avisos
                  INNER JOIN tipus_avisos USING (id_tipus_avis)
         WHERE ?
           AND IFNULL(CURRENT_DATE >= data_inici, TRUE)
           AND IFNULL(CURRENT_DATE < data_final, TRUE)
         LIMIT 1;`,
      { id_tipus_avis }
    )
    .then(([avis]) => {
      try {
        avis.seccions = JSON.parse(avis.seccions);
        avis.acceptacions = JSON.parse(avis.acceptacions);
      } catch (e) {
        next(e);
        return res.end();
      }

      res.json(avis);
    })
    .catch((e) => next(e));
};
