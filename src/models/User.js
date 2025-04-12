import { pgTable, uuid, varchar, boolean, timestamp } from "drizzle-orm/pg-core";

export const User = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    isBlocked: boolean("is_blocked").default(false),
    isAdmin: boolean("is_admin").default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    lastLogin: timestamp("last_login", { withTimezone: true }),
});