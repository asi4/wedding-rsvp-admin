import mongoose, { Document, Schema } from "mongoose";
export interface GuestEntry {
    whereFrom: string;
    name: string;
    phone: string;
    guestsShouldBe: number;
}

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    isActive: boolean;
    createdAt?: Date;
    apiCredentials: {
        twilioAccountSid: string,
        twilioAuthToken: string,
    },
    role: string, // "admin" or "user"
    csvFilename: string,
    csvData: GuestEntry[],
}

const userSchema = new Schema<IUser>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // hashed password
    createdAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: false },
    apiCredentials: {
        twilioAccountSid: { type: String},
        twilioAuthToken: { type: String},
    },
    role: { type: String, default: "user" }, // "admin" or "user"
    csvFilename: { type: String},
    csvData: {
        type: [
            {
                whereFrom: { type: String },
                name: { type: String },
                phone: { type: String },
                guestsShouldBe: { type: Number },
            }
        ],
        default: [],
    },
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
