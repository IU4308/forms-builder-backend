import { pgTable, uuid, varchar, boolean, timestamp, text } from 'drizzle-orm/pg-core';
import { User } from './User.js';
import { Template } from './Template.js';

export const Form = pgTable('forms', {
  id: uuid('id').primaryKey().defaultRandom(),
  authorId: uuid('author_id').references(() => User.id, { onDelete: 'cascade' }),
  templateId: uuid('template_id').references(() => Template.id, { onDelete: 'cascade' }),
  submittedAt: timestamp('submitted_at').defaultNow(),

  singleLine1Answer: varchar('single_line1_answer', { length: 255 }).default(null),
  singleLine2Answer: varchar('single_line2_answer', { length: 255 }).default(null),
  singleLine3Answer: varchar('single_line3_answer', { length: 255 }).default(null),
  singleLine4Answer: varchar('single_line4_answer', { length: 255 }).default(null),

  multipleLine1Answer: text('multiple_line1_answer').default(null),
  multipleLine2Answer: text('multiple_line2_answer').default(null),
  multipleLine3Answer: text('multiple_line3_answer').default(null),
  multipleLine4Answer: text('multiple_line4_answer').default(null),

  integerValue1Answer: varchar('integer_value1_answer', { length: 255 }).default(null),
  integerValue2Answer: varchar('integer_value2_answer', { length: 255 }).default(null),
  integerValue3Answer: varchar('integer_value3_answer', { length: 255 }).default(null),
  integerValue4Answer: varchar('integer_value4_answer', { length: 255 }).default(null),
  
  checkbox1Answer: varchar('checkbox1_answer', { length: 255 }).default(null),
  checkbox2Answer: varchar('checkbox2_answer', { length: 255 }).default(null),
  checkbox3Answer: varchar('checkbox3_answer', { length: 255 }).default(null),
  checkbox4Answer: varchar('checkbox4_answer', { length: 255 }).default(null)
})
