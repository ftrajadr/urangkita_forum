import pool from '../config/db.js';
import { sendSuccess, sendError } from '../utils/response.util.js';

export const reportUserAdd = async (req, res) => {
    try {
        const { reportedId } = req.params;
        const { reason } = req.body;
        const reporterId = req.user.id;

        if (reporterId === Number(reportedId)) {
            return sendError(res, 'Kamu tidak bisa melaporkan diri kamu sendiri', 400);
        }

        const [reportedUser] = await pool.query(`
            SELECT id FROM users WHERE id = ?
        `, [reportedId]);

        if (reportedUser.length === 0) {
            return sendError(res, 'User tidak ditemukan', 404);
        }

        const [isExists] = await pool.query(`
            SELECT * FROM report_user WHERE reporter_id = ? AND reported_id = ?
        `, [reporterId, reportedId]);

        if (isExists.length > 0) {
            return sendError(res, 'Kamu sudah melaporkan user ini', 400)
        }

        const [result] = await pool.query(`
            INSERT INTO report_user (reporter_id, reported_id, reason)
            VALUES (?, ?, ?)
        `, [reporterId, reportedId, reason]);

        return sendSuccess(res, 'Berhasil melaporkan user', result.insertId);
    } catch (err) {
        return sendError(res, err.message);
    }
}

export const reportUserList = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT r.*, 
            u1.username AS reporter_name,
            u2.username AS reported_name
            FROM report_user r
            LEFT JOIN users u1 ON r.reporter_id = u1.id
            LEFT JOIN users u2 ON r.reported_id = u2.id
            ORDER BY r.created_at DESC
        `);

        return sendSuccess(res, 'Daftar user yang dilaporkan berhasil diambil', rows);
    } catch (err) {
        return sendError(res, err.message);
    }
}

export const reportUserIgnore = async (req, res) => {
    try {
        const { id } = req.params;

        const [isExists] = await pool.query(`
            SELECT * FROM report_user WHERE id = ?
        `, [id]);

        if (isExists.length === 0) {
            return sendError(res, 'Laporan tidak ditemukan', 404);
        }

        await pool.query(`DELETE FROM report_user WHERE id = ?`, [id]);

        return sendSuccess(res, 'Laporan berhasil dihapus');
    } catch (err) {
        return sendError(res, err.message);
    }
}

export const reportTopicAdd = async (req, res) => {
    try {
        const { reportedTopicId } = req.params;
        const { reason } = req.body;
        const reporterId = req.user.id;

        const [reportedTopic] = await pool.query(`
            SELECT id FROM topics WHERE id = ?
        `, [reportedTopicId]);

        if (reportedTopic.length === 0) {
            return sendError(res, 'Topik tidak ditemukan', 404);
        }

        const [isExists] = await pool.query(`
            SELECT id FROM report_topic WHERE reporter_id = ? AND topic_id = ?
        `, [reporterId, reportedTopicId]);

        if (isExists.length > 0) {
            return sendError(res, 'Kamu sudah melaporkan topik ini', 400);
        }

        const [result] = await pool.query(`
            INSERT INTO report_topic (reporter_id, topic_id, reason)
            VALUES (?, ?, ?)
        `, [reporterId, reportedTopicId, reason]);

        return sendSuccess(res, 'Berhasil melaporkan topik', result.insertId);
    } catch (err) {
        return sendError(res, err.message);
    }
}

export const reportTopicList = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT r.*,
            u.username AS reporter_name,
            t.title AS topic_title,
            ua.username AS topic_author
            FROM report_topic r
            LEFT JOIN users u ON r.reporter_id = u.id
            LEFT JOIN topics t ON r.topic_id = t.id
            LEFT JOIN users ua ON t.user_id = ua.id
            ORDER BY r.created_at DESC
        `);

        return sendSuccess(res, 'Daftar topik yang dilaporkan berhasil diambil', rows);
    } catch (err) {
        return sendError(res, err.message);
    }
}

export const reportTopicIgnore = async (req, res) => {
    try {
        const { id } = req.params;

        const [isExists] = await pool.query(`
            SELECT id FROM report_topic WHERE id = ?
        `, [id]);

        if (isExists.length === 0) {
            return sendError(res, 'Laporan tidak ditemukan', 404);
        }

        await pool.query(`DELETE FROM report_topic WHERE id = ?`, [id]);

        return sendSuccess(res, 'Laporan berhasl dihapus');
    } catch (err) {
        return sendError(res, err.message);
    }
}

export const reportCommentAdd = async (req, res) => {
    try {
        const { topicId, reportedCommentId } = req.params;
        const { reason } = req.body;
        const reporterId = req.user.id;

        const [topic] = await pool.query(`
            SELECT id FROM topics WHERE id = ?
        `, [topicId]);

        if (topic.length === 0) {
            return sendError(res, 'Topik tidak ditemukan', 404);
        }

        const [reportedComment] = await pool.query(`
            SELECT id FROM comments WHERE id = ? AND topic_id = ?
        `, [reportedCommentId, topicId]);

        if (reportedComment.length === 0) {
            return sendError(res, 'Komen tidak ditemukan', 404);
        }

        const [isExists] = await pool.query(`
            SELECT id FROM report_comment WHERE reporter_id = ? AND comment_id = ? AND topic_id = ?
        `, [reporterId, reportedCommentId, topicId]);

        if (isExists.length > 0) {
            return sendError(res, 'Kamu sudah melaporkan komen ini', 400);
        }

        const [result] = await pool.query(`
            INSERT INTO report_comment (reporter_id, topic_id, comment_id, reason)
            VALUES (?, ?, ?, ?)
        `, [reporterId, topicId, reportedCommentId, reason]);

        return sendSuccess(res, 'Komen berhasil dilaporkan', result.insertId);
    } catch (err) {
        return sendError(res, err.message);
    }
}

export const reportCommentList = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT r.*,
            u.username AS reporter_name,
            t.title AS topic_title,
            c.content AS comment_content,
            ua.username AS comment_author
            FROM report_comment r
            LEFT JOIN users u ON r.reporter_id = u.id
            LEFT JOIN topics t ON r.topic_id = t.id
            LEFT JOIN comments c ON r.comment_id = c.id
            LEFT JOIN users ua ON c.user_id = ua.id
            ORDER BY r.created_at DESC
        `);

        return sendSuccess(res, 'Daftar komen yang dilaporkan berhasil diambil', rows);
    } catch (err) {
        return sendError(res, err.message);
    }
}

export const reportCommentIgnore = async (req, res) => {
    try {
        const { id } = req.params;

        const [isExists] = await pool.query(`
            SELECT id FROM report_comment WHERE id = ?
        `, [id]);

        if (isExists.length === 0) {
            return sendError(res, 'Laporan tidak ditemukan', 404);
        }

        await pool.query(`DELETE FROM report_comment WHERE id = ?`, [id]);

        return sendSuccess(res, 'Laporan berhasil dihapus');
    } catch (err) {
        return sendError(res, err.message);
    }
}
