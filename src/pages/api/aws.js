import AWS from 'aws-sdk';
import formidable from 'formidable-serverless';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

const s3 = new AWS.S3({
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  region: "us-east-1",
  bucket_name: "nattiana"
});



export default async function handler(req, res) {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();

    console.log('@@@@@@@@@@@@s3', s3);
    console.log('@@@@@@@@@@@@req', req);

    form.parse(req, (err, fields, files) => {

      if (err) {
        return res.status(500).json({ error: 'Error parsing the files' });
      }

      console.log('@@@@@@@@@@@@files2', files);

      const file = files.file.path;

      console.log('@@@@@@@@@@@@file3', file);

      // replace spaces with underscores
      const fileName = `uploads/${Date.now()}-${files.file.name.replace(/\s/g, '_')}`;

      console.log('@@@@@@@@@@@@file4', fileName);

      const fileContent = fs.readFileSync(file);

      console.log('@@@@@@@@@@@@file5', fileContent);

      const params = {
        Bucket: "nattiana",
        Key: fileName,
        Body: fileContent,
      };

      console.log('@@@@@@@@@@@@params6', params);

      s3.upload(params, function(s3Err, data) {

        if (s3Err) {
            console.log('@@@@@@@@@@@@s3Error', s3Err);
            return res.status(500).json({ error: 'Error uploading to S3' });
        }

        console.log(`@@@@@@@@@@@@File uploaded successfully at ${data.Location}`);

        res.status(200).json({ url: data.Location });
        
      });
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
