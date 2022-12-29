import mongoose, { Document, Model, Schema } from "mongoose";
import { ObjectID } from 'bson';

export type UserDocument = mongoose.Document & {
    email: string;
    name: string;
};

const userSchema = new mongoose.Schema<UserDocument>(
    {
        email: { type: String, unique: true },
        name: String,
    },
    { timestamps: true },
);

export const User = mongoose.model<UserDocument>("User", userSchema);