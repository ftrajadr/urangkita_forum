import pool from '../config/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { sendSuccess, sendError } from '../utils/response.util.js';

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const [existingUser] = await pool.query(`
            SELECT id FROM users WHERE username = ? OR email = ?
        `, [username, email]);

        if (existingUser.length > 0) {
            return sendError(res, 'Username atau Email sudah terdaftar', 400);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await pool.query(`
            INSERT INTO users (username, email ,password)
            VALUES (?, ?, ?)
        `, [username, email, hashedPassword]);

        return sendSuccess(res, 'Registrasi berhasil', { userId: result.insertId }, 201);
    } catch (err) {
        return sendError(res, err.message);
    }
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        
        const [users] = await pool.query(`
            SELECT * FROM users
            WHERE email = ?
        `, [email]);

        if (users.length === 0) {
            return sendError(res, 'Email salah', 401);
        }

        const user = users[0];
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return sendError(res, 'Password Salah', 401);
        }

        const token = jwt.sign({
            id: user.id,
            role: user.role
        }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in ms
        });

        return sendSuccess(res, 'Login Berhasil', {
            token: token,
            user: {
                id: user.id,
                role: user.role
            }
        });
    } catch (err) {
        return sendError(res, err.message);
    }
}

export const logout = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return sendSuccess(res, 'Tidak ada yang mau dilogout/ Sudah dalam kondisi logout');
        }

        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });

        return sendSuccess(res, 'Logout berhasil');
    } catch (err) {
        return sendError(res, err.message);
    }
}

export const sendUserData = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return sendSuccess(res, 'Tidak ada data');
        }

        const userToken = jwt.verify(token, process.env.JWT_SECRET);
        if (!userToken) {
            return sendError(res, 'Token invalid atau kedaluwarsa');
        }

        const userId = userToken.id;

        const [users] = await pool.query(`
            SELECT id, username, email, role, created_at, updated_at
            FROM users
            WHERE id = ?
        `, [userId]);

        if (users.length === 0) {
            return sendError(res, 'User tidak ditemukan');
        }

        const user = users[0];

        return sendSuccess(res, 'Data pengguna berhasil diambil', { user: user });
    } catch (err) {
        return sendError(res, err.message);
    }
}