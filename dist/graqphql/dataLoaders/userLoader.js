"use strict";
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
exports.userLoader = void 0;
// Imports
const dataloader_1 = __importDefault(require("dataloader"));
const mongoose_1 = require("mongoose");
const user_model_1 = require("../../app/modules/user/user.model");
const batchUsers = (userIds) => __awaiter(void 0, void 0, void 0, function* () {
    const userObjectIds = userIds.map((id) => new mongoose_1.Types.ObjectId(id));
    const users = yield user_model_1.User.find({ _id: { $in: userObjectIds } });
    // Formatting to pass in data loader
    const userData = {};
    users.forEach((user) => {
        userData[user._id] = user;
    });
    return userIds.map((userId) => userData[userId]);
});
exports.userLoader = new dataloader_1.default(batchUsers);
