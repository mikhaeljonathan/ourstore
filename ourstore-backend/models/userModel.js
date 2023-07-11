import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, 'A user must have an email'],
        trim: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Email ({VALUE}) is not in the right format']
    },
    username: {
        type: String,
        required: [true, 'A user must have a username'],
        trim: true,
        unique: true,
        lowercase: true,
        maxlength: [20, 'Username ({VALUE}) exceeds the char limit (20)']
    },
    password: {
        type: String,
        required: [true, 'A user must have a password'],
        select: false,
    },
    role: {
        type: String,
        enum: ['customer', 'admin'],
        default: 'customer'
    },
    passwordChangedAt: {
        type: Date,
        default: new Date()
    },
    passwordResetToken: {
        type: String,
        select: false
    },
    passwordResetExpires: {
        type: Date
    },
    otp: {
        type: String
    },
    verified: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true,
        select: false
    }
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();
    this.passwordChangedAt = Date.now() - 1000; // to mitigate the case that jwt token generated is older than passwordChangedAt
    next();
})

userSchema.pre(/^find/, function (next) {
    this.find({ isActive: { $ne: false } });
    next();
})

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }

    // false means not changed
    return false;
}

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    return resetToken;
}

const User = mongoose.model('User', userSchema);

export default User;