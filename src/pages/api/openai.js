import OpenAI from 'openai';

export default async function handler(req, res) {
    const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });
    const { base64Image } = req.body;

    // api call
    const response = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    messages: [
        {
        role: "system",
        content: "Here's a photo of a wine label. Roast the person having this wine. Sound like a sassy sommelier in brooklyn, new york. Make it fun, maybe even a little rude, end with a haiku. Keep it about 500 characters",
        },
        {
        role: "user",
        content: [
            {
            type: "image_url",
            image_url: {
                url: "https://heartsbushwick.com/cdn/shop/products/image_81c027a4-6a42-4e2c-9a67-12a3e09ce295_3024x.jpg?v=1614552627",
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
}