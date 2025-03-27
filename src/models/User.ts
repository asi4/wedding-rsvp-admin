import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    name: string;
    lastName: string;
    email: string;
    password: string;
    formId: string; // Unique ID for linking the user's form/guests collection
    createdAt?: Date;
    apiCredentials: {
        twilioAccountSid: String,
        twilioAuthToken: String,
        // add other credentials here.
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
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // hashed password
    formId: { type: String, required: true, unique: true }, // used to separate collections/assets
    createdAt: { type: Date, default: Date.now },
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
