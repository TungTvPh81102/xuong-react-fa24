import User from "../../models/User";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { SMTPClient } from "emailjs";
import { JWT_SECRET } from "../../config/env";
import { StatusCodes } from "http-status-codes";

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Email đã được sử dụng" });
    }

    // Kiểm tra xem có người dùng nào trong hệ thống chưa
    const userCount = await User.countDocuments({});
    const role = userCount === 0 ? "admin" : "customer";

    const user = await User.create({ username, email, password, role });
    return res
      .status(StatusCodes.HTTP_CREATED)
      .json({ message: "Đăng ký thành công", user });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Đã xảy ra lỗi trong quá trình đăng ký" });
  }
};

// Đăng nhập người dùng
export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    console.log(user)

    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Người dùng không tồn tại" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Mật khẩu không đúng" });
    }

    // Cập nhật lastLogin
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    user.password = undefined;
    user.role = undefined;
    user.status = undefined;

    res.status(StatusCodes.OK).json({ token, user });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

// Lấy thông tin người dùng hiện tại
export const getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Không có quyền truy cập" });
    }

    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Đã xảy ra lỗi trong quá trình lấy thông tin người dùng",
    });
  }
};

// Yêu cầu đặt lại mật khẩu
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    // Tạo token đặt lại mật khẩu
    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    // Tạo client emailjs
    const client = new SMTPClient({
      user: import.meta.env.EMAIL_USER_NAME,
      password: import.meta.env.EMAIL_PASSOWRD,
      host: "smtp.gmail.com",
      ssl: true,
    });

    // Gửi email với token đặt lại mật khẩu
    const message = {
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
                   Please click on the following link, or paste this into your browser to complete the process:\n\n
                   http://${req.headers.host}/reset/${token}\n\n
                   If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      from: "passwordreset@yourdomain.com",
      to: user.email,
      subject: "Password Reset",
    };

    client.send(message, (err, message) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      res.status(200).json({ message: "Email đặt lại mật khẩu đã được gửi" });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Đặt lại mật khẩu
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Token đặt lại mật khẩu không hợp lệ hoặc đã hết hạn",
      });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Mật khẩu đã được đặt lại thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
