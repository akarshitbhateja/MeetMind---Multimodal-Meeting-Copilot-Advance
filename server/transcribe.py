# server/transcribe.py
import whisper
import sys
import os

# Get the audio file path from the command-line arguments
audio_file_path = sys.argv[1]

# Load the base English model (it's fast and effective)
model = whisper.load_model("base.en")

# Perform the transcription
result = model.transcribe(audio_file_path)

# Print the final transcript text to standard output
# Our Node.js app will listen for this output
print(result["text"])

# Clean up the uploaded file
os.remove(audio_file_path)