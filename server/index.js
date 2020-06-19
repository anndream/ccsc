const path = require("path");
const express = require("express");
const app = express();

process
  .on("unhandledRejection", (reason, p) => {
    console.error(reason, "Unhandled Rejection at Promise", p);
  })
  .on("uncaughtException", (err) => {
    console.error(err, "Uncaught Exception thrown");
    process.exit(1);
  });

const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.use(express.static(path.resolve(__dirname, "../client/build")));

app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

const poolPromise = require("./config/db.config");
let pool;

app.use(async (req, res, next) => {
  if (pool) return next();

  try {
    pool = await poolPromise;
    app.set("pool", pool);
    next();
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

app.use("/api/agrupacio", require("./routes/agrupacions.routes"));
app.use("/api/assajos", require("./routes/assajos.routes"));
app.use("/api/concerts", require("./routes/concerts.routes"));
app.use("/api/esdeveniments", require("./routes/esdeveniments.routes"));
app.use("/api/formacions", require("./routes/formacions.routes"));
app.use("/api/establiments", require("./routes/establiments.routes"));
app.use("/api/localitzacions", require("./routes/localitzacions.routes"));
app.use("/api/obres", require("./routes/obres.routes"));
app.use("/api/projectes", require("./routes/projectes.routes"));
app.use("/api/socis", require("./routes/socis.routes"));
app.use("/api/titulars", require("./routes/titulars.routes"));
app.use("/api/usuaris", require("./routes/usuaris.routes"));

app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

app.use("/api/auth", require("./routes/auth.routes"));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0";

app.listen(PORT, HOST);
console.log(`Running on http://localhost:${PORT}`);
