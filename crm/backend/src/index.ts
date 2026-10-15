
import {Hono} from "hono";
import { AppEnv } from "./types";
import authRoutes from "./auth/auth.routes";

const app = new Hono<AppEnv>();

app.use("/api/auth/*", async (c, next) => {
  c.header("Cache-Control", "no-store");

  await next();
});

app.get("/", (c) =>{
	return c.text("backend funcionando");
});

app.get("/api/db-check", async (c) => {
	try {
		if(!c.env.DB){
			return c.json(
				{
					"ok": false,
					"error": "no existe el bidding"
				},
				500
			);
		}

		const connection = await c.env.DB
			.prepare("select 1 as connected")
			.first<{connected: number}>();

		const {results: tables} = await c.env.DB
			.prepare(`
				SELECT name
				FROM sqlite_master
				WHERE type = 'table'
				AND name NOT LIKE 'sqlite_%'
				ORDER BY name
            `)
			.all<{name:string}>();

		return c.json({
			"ok": connection?.connected === 1,
			"tables": tables.map((table) => table.name)
		})
	} catch(error){
		console.error("error al consultar d1: ", error);

		return c.json(
			{
				"ok": false,
				"error": 
					error instanceof Error 
						? error.message 
						: "error desconocido"
			},
			500
		);
	}
});

app.route("/api/auth", authRoutes);

// manejador global de errores
app.onError((error, c) => {
  console.error("Error interno del backend:", error);

  return c.json(
    {
      error: "Error interno del servidor",
    },
    500,
  );
});

export default app;

