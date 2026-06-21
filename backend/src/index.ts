import fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import path from "path";
import { fileURLToPath } from "url";
import autoload from "@fastify/autoload";
import cors from "@fastify/cors";

const version = "0.0.4";

const app = fastify({ logger: true });

async function start() {
  await app.register(cors, {
    origin: true,
  });

  process.on("uncaughtException", (err: Error) => {
    app.log.error(`Uncaught Exception: ${err}`);
  });

  process.on("unhandledRejection", (reason, promise) => {
    app.log.error(`Unhandled Rejection at: ${promise} reason: ${reason}`);
  });

  app.setErrorHandler((error, request, reply) => {
    app.log.error(`Global error handler: ${error}`);
    reply.status(500).send({ error: "Internal Server Error" });
  });

  await app.register(fastifySwagger, {
    swagger: {
      info: {
        title: "Tracker",
        description:
          "This app lets you track personal data like notes, time tracking, nutrient and medication intake, etc.",
        version,
      },
    },
  });

  await app.register(fastifySwaggerUi, {
    routePrefix: "/docs",
    exposeRoute: true,
  });

  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  await app.register(autoload, {
    dir: path.join(__dirname, "routes"),
    forceESM: true,
  });

  app.get("/", async (_, reply) => {
    reply.redirect("/docs", 302);
  });

  await app.listen({
    port: 4000,
    host: "127.0.0.1",
  });
}

start().catch((err) => {
  app.log.error(err);
  process.exit(1);
});