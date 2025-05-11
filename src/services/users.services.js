import { sql } from "drizzle-orm"
import { db } from "../config/db.js"

export const fetchAggregatedResults = async (userId) => {
    return await db.execute(sql`
        SELECT template_title, template_author, question, answer, type, COUNT(*) as count
            FROM (
                SELECT 
                    t.title AS template_title,
                    u.name AS template_author,
                    t.single_line1_question AS question,
                    f.single_line1_answer AS answer,
                    'single_line' AS type
                FROM forms f
                JOIN templates t ON f.template_id = t.id
                JOIN users u ON t.creator_id = u.id
                WHERE u.id = ${userId}
                AND t.single_line1_position >= 0

                UNION ALL

                SELECT 
                    t.title,
                    u.name,
                    t.single_line2_question,
                    f.single_line2_answer,
                    'single_line'
                FROM forms f
                JOIN templates t ON f.template_id = t.id
                JOIN users u ON t.creator_id = u.id
                WHERE u.id = ${userId}
                AND t.single_line2_position >= 0

                UNION ALL

                SELECT 
                    t.title,
                    u.name,
                    t.single_line3_question,
                    f.single_line3_answer,
                    'single_line'
                FROM forms f
                JOIN templates t ON f.template_id = t.id
                JOIN users u ON t.creator_id = u.id
                WHERE u.id = ${userId}
                AND t.single_line3_position >= 0

                UNION ALL

                SELECT 
                    t.title,
                    u.name,
                    t.single_line4_question,
                    f.single_line4_answer,
                    'single_line'
                FROM forms f
                JOIN templates t ON f.template_id = t.id
                JOIN users u ON t.creator_id = u.id
                WHERE u.id = ${userId}
                AND t.single_line4_position >= 0

                UNION ALL

                SELECT 
                    t.title,
                    u.name,
                    t.multiple_line1_question,
                    f.multiple_line1_answer,
                    'multiple_line'
                FROM forms f
                JOIN templates t ON f.template_id = t.id
                JOIN users u ON t.creator_id = u.id
                WHERE u.id = ${userId}
                AND t.multiple_line1_position >= 0

                UNION ALL

                SELECT 
                    t.title,
                    u.name,
                    t.multiple_line2_question,
                    f.multiple_line2_answer,
                    'multiple_line'
                FROM forms f
                JOIN templates t ON f.template_id = t.id
                JOIN users u ON t.creator_id = u.id
                WHERE u.id = ${userId}
                AND t.multiple_line2_position >= 0

                UNION ALL

                SELECT 
                    t.title,
                    u.name,
                    t.multiple_line3_question,
                    f.multiple_line3_answer,
                    'multiple_line'
                FROM forms f
                JOIN templates t ON f.template_id = t.id
                JOIN users u ON t.creator_id = u.id
                WHERE u.id = ${userId}
                AND t.multiple_line3_position >= 0

                UNION ALL

                SELECT 
                    t.title,
                    u.name,
                    t.multiple_line4_question,
                    f.multiple_line4_answer,
                    'multiple_line'
                FROM forms f
                JOIN templates t ON f.template_id = t.id
                JOIN users u ON t.creator_id = u.id
                WHERE u.id = ${userId}
                AND t.multiple_line4_position >= 0

                UNION ALL

                SELECT 
                    t.title,
                    u.name,
                    t.integer_value1_question,
                    f.integer_value1_answer,
                    'integer_value'
                FROM forms f
                JOIN templates t ON f.template_id = t.id
                JOIN users u ON t.creator_id = u.id
                WHERE u.id = ${userId}
                AND t.integer_value1_position >= 0

                UNION ALL

                SELECT 
                    t.title,
                    u.name,
                    t.integer_value2_question,
                    f.integer_value2_answer,
                    'integer_value'
                FROM forms f
                JOIN templates t ON f.template_id = t.id
                JOIN users u ON t.creator_id = u.id
                WHERE u.id = ${userId}
                AND t.integer_value2_position >= 0

                UNION ALL

                SELECT 
                    t.title,
                    u.name,
                    t.integer_value3_question,
                    f.integer_value3_answer,
                    'integer_value'
                FROM forms f
                JOIN templates t ON f.template_id = t.id
                JOIN users u ON t.creator_id = u.id
                WHERE u.id = ${userId}
                AND t.integer_value3_position >= 0

                UNION ALL

                SELECT 
                    t.title,
                    u.name,
                    t.integer_value4_question,
                    f.integer_value4_answer,
                    'integer_value'
                FROM forms f
                JOIN templates t ON f.template_id = t.id
                JOIN users u ON t.creator_id = u.id
                WHERE u.id = ${userId}
                AND t.integer_value4_position >= 0

                UNION ALL

                SELECT 
                    t.title,
                    u.name,
                    t.checkbox1_question,
                    f.checkbox1_answer::text,
                    'checkbox'
                FROM forms f
                JOIN templates t ON f.template_id = t.id
                JOIN users u ON t.creator_id = u.id
                WHERE u.id = ${userId}
                AND t.checkbox1_position >= 0

                UNION ALL

                SELECT 
                    t.title,
                    u.name,
                    t.checkbox2_question,
                    f.checkbox2_answer::text,
                    'checkbox'
                FROM forms f
                JOIN templates t ON f.template_id = t.id
                JOIN users u ON t.creator_id = u.id
                WHERE u.id = ${userId}
                AND t.checkbox2_position >= 0

                UNION ALL

                SELECT 
                    t.title,
                    u.name,
                    t.checkbox3_question,
                    f.checkbox3_answer::text,
                    'checkbox'
                FROM forms f
                JOIN templates t ON f.template_id = t.id
                JOIN users u ON t.creator_id = u.id
                WHERE u.id = ${userId}
                AND t.checkbox3_position >= 0

                UNION ALL

                SELECT 
                    t.title,
                    u.name,
                    t.checkbox4_question,
                    f.checkbox4_answer::text,
                    'checkbox'
                FROM forms f
                JOIN templates t ON f.template_id = t.id
                JOIN users u ON t.creator_id = u.id
                WHERE u.id = ${userId}
                AND t.checkbox4_position >= 0
            ) AS all_answers
            GROUP BY template_title, template_author, question, answer, type
    `)
}