const morgan = require("morgan");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const webpack = require("webpack");
const devMiddleware = require("webpack-dev-middleware");
const hotMiddleware = require("webpack-hot-middleware");
const webPackConfig = require("../webpack.dev.js");
const history = require("connect-history-api-fallback");
const { uuid, dbURL } = require("./config/config");

const express = require("express");
const server = express();

server.use(
  history({
    rewrites: [
      {
        from: /^(?!(\/api)|(\/public)).*/,
        to: "/",
      },
    ],
  })
);

const http = require("http").createServer(server);
const io = require("socket.io")(http);

const compiler = webpack(webPackConfig);

server.use(
  devMiddleware(compiler, {
    publicPath: "/public",
    // publicPath与WebPack中的output.publicPath一致
    stats: { colors: true },
    // 提示信息
  })
);

server.use(hotMiddleware(compiler));

server.use(express.json());
server.use(express.urlencoded());

server.use(morgan("tiny"));

server.set("trust proxy", 1);
// 信任代理，即可以由代码跳转到另一个网址
server.use(
  session({
    secret: uuid,
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true },
    // 设置之后cookie只能通过https协议生效
    store: MongoStore.create({ mongoUrl: dbURL + "talkroom" }),
  })
);

server.use("/img", express.static("./public/img"));
server.use("/js", express.static("./public/js"));
server.use("/css", express.static("./public/css"));

const router = require("./routers/index")(io);
server.use(router);

server.use((req, res) => {
  res.send("404 NOT FOUND");
});

http.listen(8000, () => {
  console.log("server running at http://localhost:8000/");
});
