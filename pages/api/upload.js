import multiParty from 'multiparty';
//Sử dụng service lưu trữ dữ liệu trên cloud s3
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import fs from 'fs';
import mime from 'mime-types';
const bucketName = `mkhoi-next-ecommerce`;

export default async function handle(req,res) {
    const form = new multiParty.Form();
    const {fields,files} = await new Promise((resolve,reject) => {
        form.parse(req, async (err, fields, files) => {
            if (err) return reject(err)
            resolve({fields, files});
        });
    });   
    console.log('length:',files.file.length);
    const client = new S3Client({
        region: 'ap-southeast-2',
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        },
    });
    const links = [];
    for(const file of files.file){
        const ext = file.originalFilename.split('.').pop();
        const newFilename = Date.now() + '.' + ext;
        await client.send(new PutObjectCommand({
            Bucket: bucketName,
            Key: newFilename,
            Body: fs.readFileSync(file.path),
            ACL: 'public-read',
            // sử dụng mime để định dạng đường dẫn
            ContentType: mime.lookup(file.path),
        }));
        const link = `https://${bucketName}.s3.amazonaws.com/${newFilename}`;
        links.push(link);
    }
    res.json({links});
}

export const config = {
    api: {bodyParser: false},
};
