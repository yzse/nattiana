# nattiana
gpt-backed natural wine recommender for wine enthusiasts & alike to discover a wide range natural wines.  recommendations are sourced from a number of well-known wine blogs.  this repo contains the code and resources necessary to deploy and run the recommendation system.  like [Vivino](https://www.vivino.com/), but for natural wine and enhanced with AI.


A. User Interaction
  1. User takes a photo of the wine label using the mobile device's camera
  2. The photo is processed and sent for image classification

B. Image Classification
  1. Utilize image classification tools or libraries (e.g., TensorFlow, PyTorch) to analyze the wine label
  2. Extract relevant information from the label, such as the wine name, vineyard, and vintage

C. Querying GPT Model
  1. Develop or find a pre-trained GPT model specifically trained on natural wine websites
  2. Use the extracted information from the label to generate a query for the GPT model
  3. Send the query to the GPT model and retrieve the tasting notes for the wine

D. Recommendation Engine
  1. Based on the tasting notes received, develop a recommendation engine
  2. Consider factors such as flavor profiles, region, and vintage to provide relevant wine recommendations
  3. Store a database of natural wines and associated tasting notes for efficient retrieval

E. User Interface
  1. Design a mobile-first website interface with a clean and intuitive layout
  2. Develop a user-friendly interface for capturing and processing images
  3. Display the tasting notes and recommendations in a visually appealing manner

F. Deployment
  1. Host the website on a suitable hosting platform (e.g., Heroku, AWS)
  2. Ensure the website is optimized for mobile devices, employing responsive design techniques
  3. Test the website thoroughly across different mobile devices and browsers

built with: typescript, gpt-4, nextjs
