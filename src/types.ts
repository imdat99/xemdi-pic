import type { RedisClient } from "bun";
// import type { JwtVariables } from "hono/jwt";

export type HonoVarTypes = {
	Variables: {
		// session: Session<SessionDataTypes>;
		// session_key_rotation: boolean;
		redis: RedisClient;
	};
};
