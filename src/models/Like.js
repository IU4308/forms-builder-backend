import {
    pgTable,
    uuid,
    serial,
    primaryKey,
    uniqueIndex,
    index,
  } from 'drizzle-orm/pg-core';
import { Template } from './Template';
import { User } from './User';
  
export const likes = pgTable(
    'likes',
    {
        id: serial('id').primaryKey(),
        templateId: uuid('template_id').notNull().references(() => Template.id),
        userId: uuid('user_id').notNull().references(() => User.id),
    },
    (table) => [
        primaryKey({ columns: [table.id], name: 'likes_pkey' }),
        uniqueIndex('unique_like').on(table.templateId, table.userId),
    ]
);