import { Request, Response } from "express";
import User from "../models/User.js";
import { parse } from "csv-parse/sync";
import * as XLSX from "xlsx";
import axios from "axios";

type GuestEntry = {
    whereFrom: string;
    name: string;
    phone: string;
    guestsShouldBe: number;
};

export const uploadSpreadsheet = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const file = req.file;

    if (!file) {
        res.status(400).json({ message: "File is required" });
        return;
    }

    try {
        const mimeType = file.mimetype;
        const buffer = file.buffer;
        let parsedData: GuestEntry[] = [];

        console.log("Uploading file:", file.originalname, file.mimetype);
        if (mimeType === "text/csv" || file.originalname.endsWith(".csv")) {
            const csvText = buffer.toString("utf-8");
            parsedData = parse(csvText, {
                columns: true,
                skip_empty_lines: true,
            }) as GuestEntry[];
        } else if (
            mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
            file.originalname.endsWith(".xlsx")
        ) {
            const workbook = XLSX.read(buffer, { type: "buffer" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            parsedData = XLSX.utils.sheet_to_json<GuestEntry>(sheet);
        } else {
            res.status(400).json({ message: "Unsupported file format" });
            return;
        }

        const user = await User.findById(id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        user.csvData = parsedData;
        await user.save();

        res.status(200).json({
            message: `File uploaded successfully. ${parsedData.length} rows stored.`,
        });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ message: "Failed to process file" });
    }
};

export const uploadFromGoogleSheet = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { sheetUrl } = req.body;

    try {
        const match = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
        if (!match) {
            res.status(400).json({ message: "Invalid Google Sheet URL" });
            return;
        }

        const sheetId = match[1];
        const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;

        const response = await axios.get<string>(csvUrl);
        const parsed = parse(response.data, {
            columns: true,
            skip_empty_lines: true,
        }) as GuestEntry[];

        const user = await User.findById(id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        user.csvData = parsed;
        await user.save();

        res.status(200).json({ message: "Google Sheet imported", rows: parsed.length });
    } catch (err) {
        console.error("Google Sheet fetch failed:", err);
        res.status(500).json({ message: "Failed to fetch Google Sheet" });
    }
};
