import AWS from 'aws-sdk';
import formidable from 'formidable-serverless';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "us-east-1",
  bucket_name: "nattiana"
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {

      if (err) {
        return res.status(500).json({ error: 'Error parsing the files' });
      }

      const file = files.file.path;

      // replace spaces with underscores
      const fileName = `uploads/${Date.now()}-${files.file.name.replace(/\s/g, '_')}`;

      const fileContent = fs.readFileSync(file);

      const params = {
        Bucket: "nattiana",
        Key: fileName,
        Body: fileContent,
      };

      s3.upload(params, function(s3Err, data) {

        if (s3Err) {
            return res.status(500).json({ error: 'Error uploading to S3' });
        }

        res.status(200).json({ url: data.Location });
        
      });
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
