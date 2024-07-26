import OpenAI from 'openai';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, dangerouslyAllowBrowser: true });
        const { image: imageUrl } = req.body;

        // initiate msg list
        
        // api call
        const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
            role: "system",
            content: process.env.NEXT_PUBLIC_PROMPT,
            },
            {
            role: "user",
            content: [
                {
                type: "image_url",
                image_url: {
                    url: imageUrl
                }
                }
            ]
            },
        ],
        max_tokens: 4096,
        });

        let formattedResponse = response.choices[0].message.content;
        formattedResponse = formattedResponse.replace(/\"/g, "");
        formattedResponse = formattedResponse.replace(/\n/g, " ");
        formattedResponse = formattedResponse.replace(/\\/g, "");

        // send response back to the client
        res.status(200).json(formattedResponse);
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}