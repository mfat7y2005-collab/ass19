"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3Service = exports.S3Service = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const client_s3_2 = require("@aws-sdk/client-s3");
const aws_1 = require("../config/aws");
const lib_storage_1 = require("@aws-sdk/lib-storage");
const crypto_1 = require("crypto");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
class S3Service {
    client;
    constructor() {
        this.client = new client_s3_1.S3Client({
            region: aws_1.awsConfig.region,
            credentials: {
                accessKeyId: aws_1.awsConfig.accessKeyId,
                secretAccessKey: aws_1.awsConfig.secretAccessKey,
            },
        });
    }
    async uploadAsset({ Bucket, file, path = "general", fileName, ContentType, ACL = "public-read", }) {
        const Key = `${path}/${fileName}`;
        const command = new client_s3_1.PutObjectCommand({
            Bucket,
            Key,
            Body: file,
            ContentType,
            ACL,
        });
        await this.client.send(command);
        return {
            Key,
            url: `https://${Bucket}.s3.${aws_1.awsConfig.region}.amazonaws.com/${Key}`,
        };
    }
    async uploadLargeAsset({ Bucket, file, path = "general", fileName, ContentType, ACL = "public-read", }) {
        const Key = `${path}/${fileName}`;
        const uploadFile = new lib_storage_1.Upload({
            client: this.client,
            params: {
                Bucket,
                Key,
                Body: file,
                ContentType,
                ACL,
            },
        });
        uploadFile.on("httpUploadProgress", (progress) => {
            if (!progress.total)
                return;
            const percent = (progress.loaded / progress.total) * 100;
            console.log(`Upload: ${percent.toFixed(2)}%`);
        });
        await uploadFile.done();
        return {
            Key,
            url: `https://${Bucket}.s3.${aws_1.awsConfig.region}.amazonaws.com/${Key}`,
        };
    }
    async uploadAssets({ Bucket, files, path = "general", ContentType, ACL = "public-read", }) {
        const results = await Promise.all(files.map((file) => {
            return this.uploadAsset({
                Bucket,
                file,
                ContentType,
                ACL,
                path,
                fileName: (0, crypto_1.randomUUID)(),
            });
        }));
        return results;
    }
    async createPresignedUploadLink({ Bucket, path = "general", fileName, ContentType, expiresIn = 60, }) {
        const Key = `${path}/${fileName}`;
        const command = new client_s3_1.PutObjectCommand({
            Bucket,
            Key,
            ContentType,
        });
        const url = await (0, s3_request_presigner_1.getSignedUrl)(this.client, command, {
            expiresIn,
        });
        return {
            Key,
            url,
        };
    }
    async createPresignedFetchLink({ Bucket, path = "general", fileName, Key: inputKey, expiresIn = 60, }) {
        const Key = inputKey ?? `${path}/${fileName}`;
        const command = new client_s3_1.GetObjectCommand({
            Bucket,
            Key,
        });
        const url = await (0, s3_request_presigner_1.getSignedUrl)(this.client, command, {
            expiresIn,
        });
        return {
            Key,
            url,
        };
    }
    async deleteAsset({ Bucket = aws_1.awsConfig.bucketName, Key, }) {
        if (!Bucket) {
            throw new Error("Bucket is required");
        }
        const command = new client_s3_2.DeleteObjectCommand({
            Bucket,
            Key,
        });
        return this.client.send(command);
    }
    async getAsset({ Bucket, Key, }) {
        const command = new client_s3_1.GetObjectCommand({
            Bucket,
            Key,
        });
        const response = await this.client.send(command);
        return {
            Body: response.Body,
            ContentType: response.ContentType,
        };
    }
}
exports.S3Service = S3Service;
exports.s3Service = new S3Service();
