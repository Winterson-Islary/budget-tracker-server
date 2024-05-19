export const _Config = {
	port: process.env.PORT,
	hostname: process.env.HOSTNAME,
	db_host: process.env.DB_HOST,
	db_user: process.env.DB_USER,
	db_password: process.env.DB_PASSWORD,
	db_name: process.env.DB_NAME,
	db_url: process.env.DB_URL,
	clerk_pem: process.env.CLERK_PEM_PUBLIC_KEY,
};

export const userConfig = {
	Get(key: keyof typeof _Config) {
		const value = _Config[key];
		if (!value) {
			console.error(`${key} not found`);
			process.exit();
		}

		return value;
	},
};
