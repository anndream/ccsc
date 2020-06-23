SELECT CONCAT(
               DATE_FORMAT(dia_inici, '%d/%m/%Y'),
               IFNULL(CONCAT(' ', TIME_FORMAT(hora_inici, '%H:%i')), '')
           )                                                         AS assaig,
       COUNT(id_persona)                                             AS convocats,
       COUNT(CASE WHEN retard THEN id_persona END)                   AS retards,
       COUNT(
               CASE WHEN id_estat_confirmacio = 1 AND NOT retard THEN id_persona END
           )                                                         AS confirmats_puntuals,
       COUNT(CASE WHEN id_estat_confirmacio = 2 THEN id_persona END) AS pendents,
       COUNT(CASE WHEN id_estat_confirmacio = 3 THEN id_persona END) AS cancelats
FROM (
         SELECT DISTINCT id_assaig,
                         id_persona,
                         dia_inici,
                         hora_inici,
                         IFNULL(id_estat_confirmacio, 1) AS id_estat_confirmacio,
                         IFNULL(retard, FALSE)           AS retard,
                         (
                             SELECT IFNULL(
                                            (
                                                SELECT GROUP_CONCAT(id_veu)
                                                FROM socis_veu_moviment_projectes
                                                         INNER JOIN veus_moviments USING (id_veu_moviment)
                                                WHERE id_soci = p.id_persona
                                            ), IFNULL(
                                                    (
                                                        SELECT GROUP_CONCAT(id_veu)
                                                        FROM socis_projectes_veu
                                                        WHERE id_soci = p.id_persona
                                                    ),
                                                    (
                                                        SELECT GROUP_CONCAT(id_veu)
                                                        FROM socis_formacions_veus
                                                                 INNER JOIN socis_formacions USING (id_soci_formacio)
                                                                 INNER JOIN formacions USING (id_formacio)
                                                        WHERE id_soci = p.id_persona
                                                    )
                                                )
                                        )
                         )                               AS id_veu
         FROM assajos a
                  INNER JOIN esdeveniments e ON (id_esdeveniment = id_assaig)
                  LEFT JOIN assistents_esdeveniment ae2 USING (id_esdeveniment)
                  LEFT JOIN persones p ON (ae2.id_soci = p.id_persona)
         WHERE p.id_persona IN (
             SELECT id_soci
             FROM socis
                      INNER JOIN socis_formacions USING (id_soci)
                      INNER JOIN assajos_formacions USING (id_formacio)
             WHERE id_assaig = a.id_assaig
         )
     ) ae
WHERE NOT EXISTS(
        (
            SELECT *
            FROM assajos
                     INNER JOIN veus_convocades_assaig USING (id_assaig)
            WHERE id_assaig = ae.id_assaig
        )
    )
   OR ae.id_veu IN
      (
          SELECT DISTINCT id_veu
          FROM assajos
                   INNER JOIN veus_convocades_assaig USING (id_assaig)
          WHERE id_assaig = ae.id_assaig
      )
GROUP BY id_assaig, dia_inici, hora_inici
ORDER BY dia_inici, hora_inici;
