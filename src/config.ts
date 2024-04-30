export const _Config = {
	A: import.meta.env.A,
	B: import.meta.env.B,
	C: import.meta.env.C,
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
