const { parseAndSendJSON } = require("../helpers");
const {
  assajos_query_helper
} = require("../query-helpers/assajos.query-helper");

exports.assajos_detall = (req, res, next) => {
  const pool = req.app.get("pool");
  const id_assaig = req.params.id;

  pool
    .query(
      `SELECT ${assajos_query_helper}
         FROM assajos a
                  INNER JOIN esdeveniments e ON a.id_assaig = e.id_esdeveniment
         WHERE ?;`,
      { id_assaig }
    )
    .then(([assaig]) =>
      parseAndSendJSON(res, next, assaig, ["agrupacions", "projectes"])
    );
};

exports.assajos_count = (req, res, next) => {
  const pool = req.app.get("pool");

  pool
    .query(
        `SELECT COUNT(*) AS assajos_count
         FROM assajos;`
    )
    .then(([{ assajos_count }]) => res.json(assajos_count))
    .catch((e) => next(e));
};

exports.assajos_historial = (req, res, next) => {
  const pool = req.app.get("pool");

  pool
    .query(
        `SELECT CONCAT('T', num, ' (', REPLACE(id_curs, '-', '–'), ')') AS x,
                (
                    SELECT COUNT(*)
                    FROM assajos
                             INNER JOIN esdeveniments e ON assajos.id_assaig = e.id_esdeveniment
                    WHERE e.dia_inici BETWEEN (SELECT t.data_inici) AND IFNULL((SELECT t.data_final), NOW())
                )                                                       AS y
         FROM trimestres t;`
    )
    .then((historial) => res.json(historial))
    .catch((e) => next(e));
};

exports.assajos_post = async (req, res, next) => {
  const pool = req.app.get("pool");
  const assaig = req.body;

  const connection = await pool.getConnection();

  const transactionRollback = (e) =>
    connection.rollback().then(() => {
      console.log("Transaction rolled back");
      next(e);
    });

  connection
    .beginTransaction()
    .then(() => {
      connection
        .query(
            `INSERT INTO esdeveniments (dia_inici, hora_inici, hora_final)
             VALUES ?;`,
          [[[assaig.dia_inici, ...assaig.hora]]]
        )
        .then(({ insertId: id_esdeveniment }) => {
          connection
            .query(
                `INSERT INTO assajos
                 VALUES ?;`,
              [
                [
                  [
                    id_esdeveniment,
                    assaig.es_general || false,
                    assaig.es_extra || false
                  ]
                ]
              ]
            )
            .then(() => {
              connection.commit();
              res.end();
            })
            .catch(transactionRollback);
        })
        .catch(transactionRollback);
    })
    .catch(transactionRollback);
};
