import crypto from 'crypto';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { Resend } from 'resend';
import { resetPasswordEmail } from '../utils/emailTemplates.js';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            generateToken(res, user._id);
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
            });
        } else {
            res.status(401).json({ message: 'Correo o contraseña incorrectos.' });
        }
    } catch (err) {
        console.error('authUser error:', err);
        res.status(500).json({ message: 'Error al iniciar sesión.' });
    }
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'Este correo ya está registrado.' });
        }

        const user = await User.create({ name, email, password });

        if (user) {
            generateToken(res, user._id);
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
            });
        } else {
            res.status(400).json({ message: 'Datos de usuario inválidos.' });
        }
    } catch (err) {
        console.error('registerUser error:', err);
        res.status(500).json({ message: 'Error al registrar el usuario.' });
    }
};

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Sesión cerrada correctamente.' });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
            });
        } else {
            res.status(404).json({ message: 'Usuario no encontrado.' });
        }
    } catch (err) {
        console.error('getUserProfile error:', err);
        res.status(500).json({ message: 'Error al obtener el perfil.' });
    }
};

// @desc    Request password reset — sends email with secure token link
// @route   POST /api/users/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        // Always respond the same way to avoid email enumeration
        if (!user) {
            return res.status(200).json({
                message: 'Si el correo existe, recibirás un enlace en breve.',
            });
        }

        // Generate a plain random token and store its SHA-256 hash
        const rawToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpire = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${rawToken}`;

        const resend = new Resend(process.env.RESEND_API_KEY);
        const { data, error } = await resend.emails.send({
            from: 'ZAMIS Print <onboarding@resend.dev>',
            to: user.email,
            subject: '🔐 Restablece tu contraseña — ZAMIS Print',
            html: resetPasswordEmail(user.name, resetUrl),
        });

        if (error) {
            console.error('Resend error:', error);
            return res.status(500).json({ message: 'Error al enviar el correo.' });
        }

        console.log(`✅ Reset email enviado a: ${user.email} | Resend ID: ${data?.id}`);
        res.status(200).json({ message: 'Si el correo existe, recibirás un enlace en breve.' });
    } catch (err) {
        console.error('forgotPassword error:', err);
        res.status(500).json({ message: 'Error al procesar la solicitud.' });
    }
};

// @desc    Reset password using token from email
// @route   PUT /api/users/reset-password/:token
// @access  Public
const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        // Hash the incoming token to compare with stored hash
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'El enlace no es válido o ha expirado.' });
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({ message: 'Contraseña actualizada correctamente.' });
    } catch (err) {
        console.error('resetPassword error:', err);
        res.status(500).json({ message: 'Error al restablecer la contraseña.' });
    }
};

// @desc    Login/Register user with Google
// @route   POST /api/users/google
// @access  Public
const googleLogin = async (req, res) => {
    try {
        const { credential } = req.body;

        // Verify the Google token
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { email, name, picture } = ticket.getPayload();

        // Check if user already exists in our database
        let user = await User.findOne({ email });

        if (!user) {
            // User doesn't exist, create a new one with a random strong password
            const randomPassword = crypto.randomBytes(16).toString('hex');
            user = await User.create({
                name,
                email,
                password: randomPassword,
                // Optional: you could save the picture if your model supported it
            });
        }

        // Generate JWT and set it in the cookie
        generateToken(res, user._id);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    } catch (err) {
        console.error('googleLogin error:', err);
        res.status(401).json({ message: 'Autenticación con Google fallida.' });
    }
};

export { authUser, registerUser, logoutUser, getUserProfile, forgotPassword, resetPassword, googleLogin };


