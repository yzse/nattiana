import OpenAI from 'openai';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });
        const { image: imageUrl } = req.body;
        // convert base64Image to url
        
        // api call
        const response = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
            {
            role: "system",
            content: "Here's a photo of a wine label. Roast the person having this wine. Sound like a sassy sommelier in brooklyn, new york. Make it fun, maybe even a little rude. Keep it about 500 characters",
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