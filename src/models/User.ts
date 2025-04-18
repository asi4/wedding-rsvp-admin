import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    isActive: boolean;
    formId: string; // Unique ID for linking the user's form/guests collection
    createdAt?: Date;
    apiCredentials: {
        twilioAccountSid: String,
        twilioAuthToken: String,
    },
    csvData: [
        {
            whereFrom: String,
            name: String,
            phone: String,
            guestsShouldBe: number
        },
    ],
}

const userSchema = new Schema<IUser>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // hashed password
    formId: { type: String, unique: true }, // used to separate collections/assets
    createdAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: false },
    apiCredentials: {
        twilioAccountSid: { type: String},
        twilioAuthToken: { type: String},
    },
    csvData: [
        {
            whereFrom: { type: String},
            name: { type: String},
            phone: { type: String},
            guestsShouldBe: { type: Number},
        },
    ],
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
