import mongoose, { Document, Model, Schema } from "mongoose";
import { ObjectID } from 'bson';


export type UserType = {
    email: string;
    name: string;
}

export type UserDocument = mongoose.Document & UserType;

const userSchema = new mongoose.Schema<UserDocument>(
    {
        email: { type: String, unique: true },
        name: String,
    },
    { timestamps: true },
);

export const User = mongoose.model<UserDocument>("User", userSchema);