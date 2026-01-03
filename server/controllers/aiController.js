// server/controllers/aiController.js
const Groq = require('groq-sdk');
const fs = require('fs');

if (!process.env.GROQ_API_KEY) {
    console.error("ERROR: GROQ_API_KEY is missing in .env file");
}

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

exports.processAudio = async (req, res) => {
    // 1. Check if file exists
    if (!req.file) {
        return res.status(400).json({ message: 'No audio file uploaded. Ensure form data key is "audio".' });
    }

    try {
        console.log(`Processing file: ${req.file.originalname}`);
        
        // 2. Transcribe with Whisper (Large v3 Turbo)
        const transcription = await groq.audio.transcriptions.create({
            file: fs.createReadStream(req.file.path),
            model: "whisper-large-v3-turbo",
            response_format: "json",
            temperature: 0.0,
        });

        const transcriptText = transcription.text;
        console.log("Transcription complete.");

        // 3. Delete temp file
        fs.unlinkSync(req.file.path);

        // 4. Summarize with Llama 3
        const prompt = `
        Summarize this meeting transcript and list action items.
        
        Transcript:
        ${transcriptText}
        
        Output Format:
        ### **Summary**
        [Summary here]
        
        ### **Action Items**
        - [Item 1]
        `;

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "openai/gpt-oss-120b",
        });

        const summaryText = chatCompletion.choices[0]?.message?.content || "";

        // 5. Send success response
        res.status(200).json({
            fullTranscript: transcriptText,
            geminiResult: summaryText,
        });

    } catch (error) {
        console.error("AI Error:", error);
        // Clean up file if error occurred
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: 'AI Processing Failed', error: error.message });
    }
};