export const _Config = {
	port: import.meta.env.PORT,
	hostname: import.meta.env.HOSTNAME,
};

export const Config = {
	Get(key: keyof typeof _Config) {
		const value = _Config[key];
		if (!value) {
			console.error(`${key} not found`);
			process.exit();
		}

		return value;
	},
};
