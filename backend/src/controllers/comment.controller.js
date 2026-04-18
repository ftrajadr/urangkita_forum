import pool from '../config/db.js';
import { sendSuccess, sendError } from '../utils/response.util.js';

export const createComment = async (req, res) => {
    try {
        const { topicId } = req.params;
        const { content } = req.body;
        const userId = req.user.id;

        const [topic] = await pool.query(`
            SELECT id FROM topics WHERE id = ?
        `, [topicId]);

        if (topic.length === 0) {
            return sendError(res, 'Topic tidak ditemukan', 404);
        }

        const [result] = await pool.query(`
            INSERT INTO comments (topic_id, user_id, content)
            VALUES (?, ?, ?)
        `, [topicId, userId, content]);

        return sendSuccess(res, 'Komentar berhasil ditambahkan', { commentId: result.insertId }, 201);
    } catch (err) {
        return sendError(res, err.message);
    }
}

export const getComment = async (req, res) => {
    try {
        const { topicId, commentId } = req.params;
        
        const [comments] = await pool.query(`
            SELECT * FROM comments
            WHERE topic_id = ? AND id = ?
        `, [topicId, commentId]);

        if (comments.length === 0) {
            return sendError(res, 'Komentar tidak ditemukan', 404);
        }

        const comment = comments[0];

        return sendSuccess(res, 'Komentar berhasil didapatkan', comment);
    } catch (err) {
        return sendError(res, err.message);
    }
}

export const editComment = async (req, res) => {
    try {
        const { topicId, commentId } = req.params;
        const { content } = req.body;
        const userId = req.user.id;

        const [comments] = await pool.query(`
            SELECT * FROM comments WHERE topic_id = ? AND id = ?
        `, [topicId, commentId]);

        if (comments.length === 0) {
            return sendError(res, 'Komentar tidak ditemukan', 404);
        }
        
        const comment = comments[0];
        if (comment.user_id !== userId) {
            return sendError(res, 'Anda tidak berhak mengedit komentar ini', 403);
        }

        await pool.query(`
            UPDATE comments
            SET content = COALESCE(?, content)
            WHERE topic_id = ? AND id = ?
        `, [content, topicId, commentId]);

        return sendSuccess(res, 'Komentar diperbarui');
    } catch (err) {
        return sendError(res, err.message);
    }
}

export const deleteComment = async (req, res) => {
    try {
        const { topicId, commentId } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        const [comments] = await pool.query(`
            SELECT * FROM comments WHERE topic_id = ? AND id = ?
        `, [topicId, commentId]);

        if (comments.length === 0) {
            return sendError(res, 'Komentar tidak ditemukan', 404);
        }

        const comment = comments[0];
        if (comment.user_id !== userId && userRole !== 'admin') {
            return sendError(res, 'Anda tidak berhak menghapus komentar ini', 403);
        }

        await pool.query(`
            DELETE FROM comments
            WHERE topic_id = ? AND id = ?
        `, [topicId, commentId]);

        return sendSuccess(res, 'Komentar berhasil dihapus');
    } catch (err) {
        return sendError(res, err.message);
    }
}

export const getAllCommentByTopic = async (req, res) => {
    try {
        const { topicId } = req.params;
        const { page = 1 } = req.query; 
        const limit = 10;
        const offset = (Number(page) - 1) * limit;

        const [totalRows] = await pool.query(
            `SELECT COUNT(*) as total FROM comments WHERE topic_id = ?`, 
            [topicId]
        );
        const totalPages = Math.ceil(totalRows[0].total / limit);

        const [comments] = await pool.query(`
            SELECT c.*, u.username
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.topic_id = ?
            ORDER BY c.created_at ASC
            LIMIT ? OFFSET ?
        `, [topicId, limit, offset]);

        return sendSuccess(res, 'Daftar komentar berhasil diambil', {
            comments,
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