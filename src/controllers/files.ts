import { NextFunction, Request, Response } from "express";

import axios from 'axios';

import { VercelResponse } from "../models/vercelResponse";
import { cache } from "../middleware/cache";

const url = 'https://rest-test-eight.vercel.app/api/test';

function createNestedObjects(obj: any, arr: string[]): any {
    if (arr.length === 0) {
        return obj;
    }

    const currentKey: string = arr.shift() as string;

    if (!obj[currentKey]) {
        obj[currentKey] = {};
    }

    return createNestedObjects(obj[currentKey], arr);
}

function convertData(obj: { [key: string]: any }): { [key: string]: any } | string[] {
    const newArray = Object.entries(obj).map(([key, value]) => {
        if (typeof value === 'object') {
            const newValue = convertData(value);
            return { [key]: newValue };
        } else {
            return key;
        }
    });
    return newArray;
}

const getFiles = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await axios.get<VercelResponse>(url);
        const rawData = response.data.items;

        const files: { [key: string]: any } = {};
        let domain: string = '';

        rawData.forEach((item, i) => {
            if (!item.fileUrl) {
                return;
            }

            const urlParts = item.fileUrl.slice(7).split('/');

            const lastUrlPart = urlParts[urlParts.length - 1];
            if (!lastUrlPart.includes('.')) {
                return;
            }

            domain = urlParts[0].split(':')[0];
            if (!files[domain]) {
                files[domain] = {};
            }

            const subDomains = urlParts.slice(1, urlParts.length - 1);
            createNestedObjects(files[domain], [...subDomains]);

            const accessedObject = subDomains.reduce((acc, key) => {
                return acc && acc[key]
            }, files[domain]);
            if (accessedObject) {
                accessedObject[lastUrlPart] = 1;
            }
        });

        files[domain] = convertData(files[domain]);

        cache.set("files", files);

        res.status(200).json(files);
    } catch (error) {
        throw error;
    }
};

export { getFiles }
