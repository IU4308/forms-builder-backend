import { pgTable, uuid, varchar, boolean, timestamp } from 'drizzle-orm/pg-core';
import { User } from './User.js';
import { Topic } from './Topic.js';
import { integer } from 'drizzle-orm/gel-core';

export const Template = pgTable('templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  creatorId: uuid('creator_id').references(() => User.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }),
  description: varchar('description', { length: 255 }),
  imageUrl: varchar('image_url', { length: 255 }).default(null),
  topicId: integer('topic_id').default(1).references(() => Topic.id, { onDelete: 'set default' }),
  isPublic: boolean('is_public').default(true),
  createdAt: timestamp('created_at').defaultNow(),

  // Single Line Fields
  singleLine1State: boolean('single_line1_state').default(false),
  singleLine1Question: varchar('single_line1_question', { length: 255 }).default(null),
  singleLine1Description: varchar('single_line1_description', { length: 255 }).default(null),
  singleLine1Position: integer('single_line1_position').default(0),

  singleLine2State: boolean('single_line2_state').default(false),
  singleLine2Question: varchar('single_line2_question', { length: 255 }).default(null),
  singleLine2Description: varchar('single_line2_description', { length: 255 }).default(null),
  singleLine2Position: integer('single_line2_position').default(0),

  singleLine3State: boolean('single_line3_state').default(false),
  singleLine3Question: varchar('single_line3_question', { length: 255 }).default(null),
  singleLine3Description: varchar('single_line3_description', { length: 255 }).default(null),
  singleLine3Position: integer('single_line3_position').default(0),

  singleLine4State: boolean('single_line4_state').default(false),
  singleLine4Question: varchar('single_line4_question', { length: 255 }).default(null),
  singleLine4Description: varchar('single_line4_description', { length: 255 }).default(null),
  singleLine4Position: integer('single_line4_position').default(0),

  // Multiple Line Fields
  multipleLine1State: boolean('multiple_line1_state').default(false),
  multipleLine1Question: varchar('multiple_line1_question', { length: 255 }).default(null),
  multipleLine1Description: varchar('multiple_line1_description', { length: 255 }).default(null),
  multipleLine1Position: integer('multiple_line1_position').default(0),

  multipleLine2State: boolean('multiple_line2_state').default(false),
  multipleLine2Question: varchar('multiple_line2_question', { length: 255 }).default(null),
  multipleLine2Description: varchar('multiple_line2_description', { length: 255 }).default(null),
  multipleLine2Position: integer('multiple_line2_position').default(0),

  multipleLine3State: boolean('multiple_line3_state').default(false),
  multipleLine3Question: varchar('multiple_line3_question', { length: 255 }).default(null),
  multipleLine3Description: varchar('multiple_line3_description', { length: 255 }).default(null),
  multipleLine3Position: integer('multiple_line3_position').default(0),

  multipleLine4State: boolean('multiple_line4_state').default(false),
  multipleLine4Question: varchar('multiple_line4_question', { length: 255 }).default(null),
  multipleLine4Description: varchar('multiple_line4_description', { length: 255 }).default(null),
  multipleLine4Position: integer('multiple_line4_position').default(0),

  // Integer Value Fields
  integerValue1State: boolean('integer_value1_state').default(false),
  integerValue1Question: varchar('integer_value1_question', { length: 255 }).default(null),
  integerValue1Description: varchar('integer_value1_description', { length: 255 }).default(null),
  integerValue1Position: integer('integer_value1_position').default(0),

  integerValue2State: boolean('integer_value2_state').default(false),
  integerValue2Question: varchar('integer_value2_question', { length: 255 }).default(null),
  integerValue2Description: varchar('integer_value2_description', { length: 255 }).default(null),
  integerValue2Position: integer('integer_value2_position').default(0),

  integerValue3State: boolean('integer_value3_state').default(false),
  integerValue3Question: varchar('integer_value3_question', { length: 255 }).default(null),
  integerValue3Description: varchar('integer_value3_description', { length: 255 }).default(null),
  integerValue3Position: integer('integer_value3_position').default(0),

  integerValue4State: boolean('integer_value4_state').default(false),
  integerValue4Question: varchar('integer_value4_question', { length: 255 }).default(null),
  integerValue4Description: varchar('integer_value4_description', { length: 255 }).default(null),
  integerValue4Position: integer('integer_value4_position').default(0),

  // Checkbox Fields
  checkbox1State: boolean('checkbox1_state').default(false),
  checkbox1Question: varchar('checkbox1_question', { length: 255 }).default(null),
  checkbox1Description: varchar('checkbox1_description', { length: 255 }).default(null),
  checkbox1Position: integer('checkbox1_position').default(0),

  checkbox2State: boolean('checkbox2_state').default(false),
  checkbox2Question: varchar('checkbox2_question', { length: 255 }).default(null),
  checkbox2Description: varchar('checkbox2_description', { length: 255 }).default(null),
  checkbox2Position: integer('checkbox2_position').default(0),

  checkbox3State: boolean('checkbox3_state').default(false),
  checkbox3Question: varchar('checkbox3_question', { length: 255 }).default(null),
  checkbox3Description: varchar('checkbox3_description', { length: 255 }).default(null),
  checkbox3Position: integer('checkbox3_position').default(0),

  checkbox4State: boolean('checkbox4_state').default(false),
  checkbox4Question: varchar('checkbox4_question', { length: 255 }).default(null),
  checkbox4Description: varchar('checkbox4_description', { length: 255 }).default(null),
  checkbox4Position: integer('checkbox4_position').default(0),
});