"use strict";
/* eslint-disable  @typescript-eslint/no-this-alias */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
// Imports
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../../config"));
const users_1 = require("../../../enums/users");
// User Schema
const userSchema = new mongoose_1.Schema({
    role: {
        type: String,
        required: true,
        enum: users_1.ENUM_USER_ROLES,
    },
    password: {
        type: String,
        required: true,
        select: 0,
    },
    passwordChangedAt: {
        type: Date,
    },
    firstName: {
        type: String,
        required: true,
    },
    middleName: {
        type: String,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    cart: {
        courses: [
            {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "Course",
                default: [],
            },
        ],
        payment: {
            subTotal: {
                type: Number,
                default: 0.0,
                set: (value) => parseFloat(value.toFixed(2)),
            },
            tax: {
                type: Number,
                default: 0.0,
                set: (value) => parseFloat(value.toFixed(2)),
            },
            grandTotal: {
                type: Number,
                default: 0.0,
                set: (value) => parseFloat(value.toFixed(2)),
            },
        },
    },
    purchases: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Course",
            default: [],
        },
    ],
}, {
    timestamps: true,
});
// Static Method to check whether user exists or not
userSchema.statics.exists = function (email) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.User.findOne({ email }, { _id: 1, email: 1, role: 1, password: 1 }).lean();
    });
};
// Static Method to check whether password matches or not
userSchema.statics.isPasswordMatched = function (givenPassword, savedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(givenPassword, savedPassword);
    });
};
// Pre Hook function to hash user password before saving in DB
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // Hashing user password before saving
        const user = this;
        user.password = yield bcrypt_1.default.hash(user.password, Number(config_1.default.bcrypt_salt_rounds));
        // Saving password changed time if password is changed
        this.passwordChangedAt = new Date();
        next();
    });
});
// User Model
exports.User = (0, mongoose_1.model)("User", userSchema);
