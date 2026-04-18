import pool from '../config/db.js';
import { sendSuccess, sendError } from '../utils/response.util.js';

export const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;

        const [users] = await pool.query(`
            SELECT id, username, role, created_at
            FROM users WHERE id = ?
        `, [userId]);

        if (users.length === 0) {
            return sendError(res, 'User tidak ditemukan', 404);
        }

        const user = users[0];

        return sendSuccess(res, 'Profile berhasil diambil', user);
    } catch (err) {
        return sendError(res, err.message);
    }
}

export const editUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { username } = req.body;
        
        await pool.query(`
            UPDATE users
            SET username = COALESCE(?, username)
            WHERE id = ?
        `, [username, userId]);

        return sendSuccess(res, 'Profile berhasil diperbarui');
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return sendError(res, 'Username sudah digunakan', 400);
        }

        return sendError(res, err.message);
    }
}