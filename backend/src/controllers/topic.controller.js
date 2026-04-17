import pool from "../config/db.js";
import { sendSuccess, sendError } from '../utils/response.util.js';

export const createTopic = async (req, res) => {
    try {
        const { categoryId, title, content } = req.body;
        const userId = req.user.id;

        const [result] = await pool.query(`
            INSERT INTO topics (user_id, category_id, title, content)
            VALUES (?, ?, ?, ?)
        `, [userId, categoryId, title, content]);

        return sendSuccess(res, 'Topic berhasil dibuat', 
            { topicId: result.insertId }, 201);
    } catch (err) {
        return sendError(res, err.message);
    }
}

export const getTopic = async (req, res) => {
    try {
        const { topicId } = req.params;

        const [topics] = await pool.query(`
            SELECT t.*, u.username, c.name as category_name
            FROM topics t
            JOIN users u ON t.user_id = u.id
            JOIN categories c ON t.category_id = c.id
            WHERE t.id = ?
        `, [topicId]);

        if (topics.length === 0) {
            return sendError(res, 'Topik tidak ditemukan', 404);
        }

        const topic = topics[0];

        return sendSuccess(res, 'Topik berhasil diambil', topic);
    } catch (err) {
        return sendError(res, err.message);
    }
}

export const editTopic = async (req, res) => {
    try {
        const { topicId } = req.params;
        const { categoryId, title, content } = req.body;
        const userId = req.user.id;

        const [topics] = await pool.query(`
            SELECT * FROM topics WHERE id = ?
        `, [topicId]);

        if (topics.length === 0) {
            return sendError(res, 'Topik tidak ditemukan', 404);
        }

        const topic = topics[0];
        if (topic.user_id !== userId) {
            return sendError(res, 'Anda tidak berhak mengedit topik ini', 403);
        }

        await pool.query(`
            UPDATE topics
            SET category_id = COALESCE(?, category_id), 
                title = COALESCE(?, title), 
                content = COALESCE(?, content)
            WHERE id = ?
        `, [categoryId, title, content, topicId]);

        return sendSuccess(res, 'Topic berhasil diperbarui');
    } catch (err) {
        return sendError(res, err.message);
    }
}

export const deleteTopic = async (req, res) => {
    try {
        const { topicId } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        const [topics] = await pool.query(`
            SELECT * FROM topics WHERE id = ?
        `, [topicId]);

        if (topics.length === 0) {
            return sendError(res, 'Topik tidak ditemukan', 404);
        }

        const topic = topics[0];
        if (topic.user_id !== userId && userRole !== 'admin') {
            return sendError(res, 'Anda tidak berhak menghapus ini', 403);
        }

        await pool.query(`
            DELETE FROM topics WHERE id = ?
        `, [topicId]);

        return sendSuccess(res, 'Topik berhasil dihapus');
    } catch (err) {
        return sendError(res, err.message);
    }
}

export const getAllTopic = async (req, res) => {
    try {
        const { search, category_id, page = 1 } = req.query;
        const limit = 10;
        const offset = (page - 1) * limit;

        let queryPart = `
            FROM topics t
            JOIN users u ON t.user_id = u.id
            LEFT JOIN categories c ON t.category_id = c.id
            LEFT JOIN comments co ON t.id = co.topic_id
        `;

        let queryParams = [];
        let whereClauses = [];

        if (search) {
            whereClauses.push(`(t.title LIKE ? OR t.content LIKE ?)`);
            queryParams.push(`%${search}%`, `%${search}%`);
        }

        if (category_id && category_id !== '0') {
            whereClauses.push(`t.category_id = ?`);
            queryParams.push(category_id);
        }

        const whereSql = whereClauses.length > 0 ? ` WHERE ` + whereClauses.join(' AND ') : '';

        const [totalRows] = await pool.query(`SELECT COUNT(DISTINCT t.id) as total ${queryPart} ${whereSql}`, queryParams);
        const totalPages = Math.ceil(totalRows[0].total / limit);

        const selectSql = `
            SELECT t.*, u.username, c.name as category_name, COUNT(co.id) as total_comments 
            ${queryPart} 
            ${whereSql} 
            GROUP BY t.id 
            ORDER BY t.created_at DESC 
            LIMIT ? OFFSET ?
        `;
        
        const [topics] = await pool.query(selectSql, [...queryParams, limit, offset]);

        return sendSuccess(res, 'Daftar topic berhasil diambil', {
            topics,
            pagination: {
                currentPage: Number(page),
                totalPages,
                totalItems: totalRows[0].total
            }
        });
    } catch (err) {
        return sendError(res, err.message);
    }
}

export const getAllTopicByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        const [topics] = await pool.query(`
            SELECT t.*, u.username, c.name as category_name, COUNT(co.id) as total_comments
            FROM topics t
            JOIN users u ON t.user_id = u.id
            LEFT JOIN categories c ON t.category_id = c.id
            LEFT JOIN comments co ON t.id = co.topic_id
            WHERE t.user_id = ?
            GROUP BY t.id
            ORDER BY t.created_at DESC
        `, [userId]);

        return sendSuccess(res, 'Daftar topic user ini berhasil diambil', topics);
    } catch (err) {
        return sendError(res, err.message);
    }
}

export const getAllCategories = async (req, res) => {
    try {
        const [categories] = await pool.query(`
            SELECT * FROM categories
            ORDER BY id
        `)

        return sendSuccess(res, 'Daftar kategori berhasil diambil', categories);
    } catch (err) {
        return sendError(res, err.message);
    }
}