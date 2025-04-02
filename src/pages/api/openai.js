import OpenAI from 'openai';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        // Check for required environment variables
        if (!process.env.OPENAI_API_KEY) {
            return res.status(500).json({ error: 'OpenAI API key missing. Set OPENAI_API_KEY environment variable.' });
        }

        if (!process.env.NEXT_PUBLIC_PROMPT) {
            return res.status(500).json({ error: 'System prompt missing. Set NEXT_PUBLIC_PROMPT environment variable.' });
        }

        try {
            const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

            const { image: imageUrl } = req.body;

            if (!imageUrl) {
                return res.status(400).json({ error: 'Image URL is required' });
            }

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
        } catch (error) {
            console.error("OpenAI API Error:", error);
            res.status(500).json({ error: error.message || 'Error processing image with OpenAI' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}