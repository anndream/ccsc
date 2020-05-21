exports.agrupacions_detall = (req, res, next) => {
  const pool = req.app.get("pool");
  const id_agrupacio = req.params.id;

  pool
    .query(
        `SELECT id_agrupacio, nom, IFNULL(nom_curt, nom) AS nom_curt, descripcio, num_persones
         FROM agrupacions
         WHERE ?;`,
      { id_agrupacio }
    )
    .then((rows) => res.json(rows))
    .catch((e) => next(e));
};

exports.agrupacions_detall_esdeveniments = (req, res, next) => {
  const pool = req.app.get("pool");
  const id_agrupacio = req.params.id;

  pool
    .query(
        `SELECT id_esdeveniment,
                IFNULL(CONCAT(dia_inici, ' ', hora_inici), dia_inici) AS data_inici,
                DATE_FORMAT(dia_inici, '%Y-%m-%d')                    AS dia_inici,
                hora_inici,
                IFNULL(CONCAT(dia_final, ' ', hora_final), dia_final) AS data_final,
                IFNULL(DATE_FORMAT(dia_final, '%Y-%m-%d'), dia_inici) AS dia_final,
                hora_final,
                id_estat_esdeveniment,
                id_estat_localitzacio,
                (
                    SELECT estat
                    FROM estats_confirmacio
                    WHERE id_estat_confirmacio = (SELECT id_estat_esdeveniment)
                )                                                     AS estat_esdeveniment,
                (
                    SELECT estat
                    FROM estats_confirmacio
                    WHERE id_estat_confirmacio = (SELECT id_estat_localitzacio)
                )                                                     AS estat_localitzacio,
                (
                    SELECT CONCAT_WS(' ', tv.nom, CONCAT(carrer, ','),
                                     CONCAT(IFNULL(CONCAT(numero, '–', fins_numero), CONCAT(numero)), ','), c.nom,
                                     CONCAT('(',
                                            (SELECT nom FROM ciutats WHERE id_ciutat = (SELECT c.id_provincia)),
                                            ')'))
                    FROM localitzacions
                             INNER JOIN tipus_vies tv USING (id_tipus_via)
                             INNER JOIN ciutats c USING (id_ciutat)
                    WHERE id_localitzacio = (SELECT esdeveniments.id_localitzacio)
                )                                                     AS localitzacio,
                (
                    SELECT e.nom
                    FROM localitzacions
                             INNER JOIN establiments e ON localitzacions.id_localitzacio = e.id_establiment
                    WHERE id_localitzacio = (SELECT esdeveniments.id_localitzacio)
                )                                                     AS establiment,
                id_esdeveniment_ajornat,
                CONCAT(
                        'Assaig',
                        IF(es_general, ' general', ''),
                        IF(es_extra, ' extra', '')
                    )                                                 AS titol,
                (
                    SELECT JSON_ARRAYAGG(
                                   JSON_OBJECT(
                                           'id_projecte', id_projecte,
                                           'titol', titol,
                                           'inicials', inicials,
                                           'color', color
                                       )
                               )
                    FROM projectes
                             INNER JOIN assajos_projectes USING (id_projecte)
                    WHERE id_assaig = (SELECT a.id_assaig)
                )                                                     AS projectes,
                'assaig'                                              AS tipus
         FROM esdeveniments
                  INNER JOIN assajos a ON esdeveniments.id_esdeveniment = a.id_assaig
                  INNER JOIN assajos_agrupacions USING (id_assaig)
         WHERE id_agrupacio = ?

         UNION

         SELECT id_esdeveniment,
                IFNULL(CONCAT(dia_inici, ' ', hora_inici), dia_inici) AS data_inici,
                DATE_FORMAT(dia_inici, '%Y-%m-%d')                    AS dia_inici,
                hora_inici,
                IFNULL(CONCAT(dia_final, ' ', hora_final), dia_final) AS data_final,
                IFNULL(DATE_FORMAT(dia_final, '%Y-%m-%d'), dia_inici) AS dia_final,
                hora_final,
                id_estat_esdeveniment,
                id_estat_localitzacio,
                (
                    SELECT estat
                    FROM estats_confirmacio
                    WHERE id_estat_confirmacio = (SELECT id_estat_esdeveniment)
                )                                                     AS estat_esdeveniment,
                (
                    SELECT estat
                    FROM estats_confirmacio
                    WHERE id_estat_confirmacio = (SELECT id_estat_localitzacio)
                )                                                     AS estat_localitzacio,
                (
                    SELECT CONCAT_WS(' ', tv.nom, CONCAT(carrer, ','),
                                     CONCAT(IFNULL(CONCAT(numero, '–', fins_numero), CONCAT(numero)), ','), c.nom,
                                     CONCAT('(',
                                            (SELECT nom FROM ciutats WHERE id_ciutat = (SELECT c.id_provincia)),
                                            ')'))
                    FROM localitzacions
                             INNER JOIN tipus_vies tv USING (id_tipus_via)
                             INNER JOIN ciutats c USING (id_ciutat)
                    WHERE id_localitzacio = (SELECT esdeveniments.id_localitzacio)
                )                                                     AS localitzacio,
                (
                    SELECT e.nom
                    FROM localitzacions
                             INNER JOIN establiments e ON localitzacions.id_localitzacio = e.id_establiment
                    WHERE id_localitzacio = (SELECT esdeveniments.id_localitzacio)
                )                                                     AS establiment,
                id_esdeveniment_ajornat,
                CONCAT('Concert ', titol)                             AS titol,
                (
                    SELECT JSON_ARRAYAGG(
                                   JSON_OBJECT(
                                           'id_projecte', id_projecte,
                                           'titol', titol,
                                           'inicials', inicials,
                                           'color', color
                                       )
                               )
                    FROM projectes
                    WHERE id_projecte = (SELECT c.id_projecte)
                )                                                     AS projectes,
                'assaig'                                              AS tipus
         FROM esdeveniments
                  INNER JOIN concerts c ON esdeveniments.id_esdeveniment = c.id_concert
                  INNER JOIN agrupacions_concerts USING (id_concert)
         WHERE id_agrupacio = ?

         UNION

         SELECT CONCAT('aniversari-', id_persona)                                   AS id_esdeveniment,
                CAST(CONCAT(?, '-', MONTH(naixement), '-', DAY(naixement)) AS DATE) AS data_inici,
                (SELECT data_inici)                                                 AS dia_inici,
                NULL                                                                AS hora_inici,
                NULL                                                                AS data_final,
                NULL                                                                AS dia_final,
                NULL                                                                AS hora_final,
                NULL                                                                AS id_estat_esdeveniment,
                NULL                                                                AS id_estat_localitzacio,
                NULL                                                                AS estat_esdeveniment,
                NULL                                                                AS estat_localitzacio,
                NULL                                                                AS localitzacio,
                NULL                                                                AS establiment,
                NULL                                                                AS id_esdeveniment_ajornat,
                nom_complet                                                         AS titol,
                NULL                                                                AS projectes,
                'aniversari'                                                        AS tipus
         FROM persones
                  INNER JOIN socis s ON persones.id_persona = s.id_soci
                  INNER JOIN socis_agrupacions USING (id_soci)
         WHERE naixement IS NOT NULL
           AND id_agrupacio = ?

         ORDER BY dia_inici, hora_inici, dia_final, hora_final;`,
      // TODO: Refaccionar l’any
      [id_agrupacio, id_agrupacio, 2020, id_agrupacio]
    )
    .then((esdeveniments) => {
      try {
        esdeveniments.forEach((esdeveniment) => {
          esdeveniment.projectes = JSON.parse(esdeveniment.projectes);
        });
      } catch (e) {
        next(e);
        return res.end();
      }

      res.json(esdeveniments);
    })
    .catch((e) => next(e));
};

exports.agrupacions_detall_assajos = (req, res, next) => {
  const pool = req.app.get("pool");
  const id_agrupacio = req.params.id;

  pool
    .query(
        `SELECT DISTINCT a.*,
                         IFNULL(CONCAT(dia_inici, ' ', hora_inici), dia_inici) AS data_inici,
                         DATE_FORMAT(dia_inici, '%Y-%m-%d')                    AS dia_inici,
                         hora_inici,
                         IFNULL(CONCAT(dia_final, ' ', hora_final), dia_final) AS data_final,
                         IFNULL(DATE_FORMAT(dia_final, '%Y-%m-%d'), dia_inici) AS dia_final,
                         hora_final,
                         (
                             SELECT estat
                             FROM estats_confirmacio
                             WHERE id_estat_confirmacio = (SELECT id_estat_esdeveniment)
                         )                                                     AS estat_esdeveniment,
                         (
                             SELECT estat
                             FROM estats_confirmacio
                             WHERE id_estat_confirmacio = (SELECT id_estat_localitzacio)
                         )                                                     AS estat_localitzacio,
                         (
                             SELECT JSON_ARRAYAGG(
                                            JSON_OBJECT(
                                                    'id_projecte', id_projecte,
                                                    'titol', titol,
                                                    'inicials', inicials,
                                                    'color', color
                                                )
                                        )
                             FROM projectes
                                      INNER JOIN assajos_projectes USING (id_projecte)
                             WHERE id_assaig = (SELECT a.id_assaig)
                         )                                                     AS projectes
         FROM esdeveniments
                  INNER JOIN assajos a ON esdeveniments.id_esdeveniment = a.id_assaig
                  INNER JOIN assajos_agrupacions USING (id_assaig)
         WHERE ?
         ORDER BY dia_inici, hora_inici, dia_final, hora_final;`,
      { id_agrupacio }
    )
    .then((assajos) => {
      try {
        assajos.forEach((assaig) => {
          assaig.projectes = JSON.parse(assaig.projectes);
        });
      } catch (e) {
        next(e);
        return res.end();
      }

      res.json(assajos);
    })
    .catch((e) => next(e));
};

exports.agrupacions_detall_concerts = (req, res, next) => {
  const pool = req.app.get("pool");
  const id_agrupacio = req.params.id;

  pool
    .query(
        `SELECT id_concert,
                IFNULL(CONCAT(dia_inici, ' ', hora_inici), dia_inici) AS data_inici,
                DATE_FORMAT(dia_inici, '%Y-%m-%d')                    AS dia_inici,
                hora_inici,
                c.titol                                               AS titol_concert,
                p.titol                                               AS titol_projecte,
                inicials                                              AS inicials_projecte,
                color                                                 AS color_projecte,
                (
                    SELECT estat
                    FROM estats_confirmacio
                    WHERE id_estat_confirmacio = (SELECT id_estat_esdeveniment)
                )                                                     AS estat_esdeveniment,
                (
                    SELECT estat
                    FROM estats_confirmacio
                    WHERE id_estat_confirmacio = (SELECT id_estat_localitzacio)
                )                                                     AS estat_localitzacio
         FROM esdeveniments
                  INNER JOIN concerts c ON esdeveniments.id_esdeveniment = c.id_concert
                  INNER JOIN agrupacions_concerts USING (id_concert)
                  LEFT JOIN projectes p USING (id_projecte)
         WHERE ?
         ORDER BY dia_inici, hora_inici;`,
      { id_agrupacio }
    )
    .then((concerts) => res.json(concerts))
    .catch((e) => next(e));
};

exports.agrupacions_detall_projectes = (req, res, next) => {
  const pool = req.app.get("pool");
  const id_agrupacio = req.params.id;

  pool
    .query(
        `SELECT projectes.id_projecte,
                titol,
                descripcio,
                inicials,
                color,
                id_curs,
                (
                    SELECT JSON_ARRAYAGG(JSON_OBJECT('id', id_director, 'nom', nom_complet))
                    FROM directors_projectes
                             INNER JOIN persones p ON directors_projectes.id_director = p.id_persona
                    WHERE id_projecte = (SELECT projectes.id_projecte)
                ) AS directors,
                (
                    SELECT JSON_ARRAYAGG(JSON_OBJECT('id', agrupacions.id_agrupacio, 'nom', nom))
                    FROM projectes_agrupacions
                             INNER JOIN agrupacions USING (id_agrupacio)
                    WHERE id_projecte = (SELECT projectes.id_projecte)
                      AND agrupacions.id_agrupacio <> ?
                ) AS agrupacions
         FROM projectes
                  INNER JOIN projectes_agrupacions USING (id_projecte)
         WHERE id_agrupacio = ?;`,
      [id_agrupacio, id_agrupacio]
    )
    .then((projectes) => {
      try {
        projectes.forEach((projecte) => {
          projecte.directors = JSON.parse(projecte.directors);
          projecte.agrupacions = JSON.parse(projecte.agrupacions);
        });
      } catch (e) {
        next(e);
        return res.end();
      }

      res.json(projectes);
    })
    .catch((e) => next(e));
};

exports.agrupacions_detall_integrants = (req, res, next) => {
  const pool = req.app.get("pool");
  const id_agrupacio = req.params.id;

  pool
    .query(
        `SELECT id_persona,
                p.nom,
                cognoms,
                nom_complet,
                (
                    SELECT nom
                    FROM veus
                    WHERE id_veu = (SELECT sa.id_veu)
                ) AS veu,
                (
                    SELECT abreviatura
                    FROM veus
                    WHERE id_veu = (SELECT sa.id_veu)
                ) AS abreviatura_veu
         FROM socis
                  INNER JOIN persones p ON socis.id_soci = p.id_persona
                  INNER JOIN socis_agrupacions sa USING (id_soci)
                  INNER JOIN agrupacions USING (id_agrupacio)
         WHERE ?
         ORDER BY id_veu;`,
      { id_agrupacio }
    )
    .then((integrants) => res.json(integrants))
    .catch((e) => next(e));
};
