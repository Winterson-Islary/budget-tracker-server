CREATE TABLE IF NOT EXISTS "category" (
	"createdAt" timestamp DEFAULT now(),
	"name" text,
	"userId" text,
	"icon" text,
	"type" text DEFAULT 'income',
	CONSTRAINT "category_name_unique" UNIQUE("name"),
	CONSTRAINT "category_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transaction" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updateAt" timestamp DEFAULT now(),
	"amount" numeric(12, 2) NOT NULL,
	"description" text,
	"date" time,
	"userId" text NOT NULL,
	"category" text,
	"categoryIcon" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "userSettings" (
	"userId" text PRIMARY KEY NOT NULL,
	"currency" text
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "transaction" ("userId");