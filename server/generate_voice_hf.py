import sys
import torch
import torchaudio
import numpy as np  # Import numpy
from transformers import pipeline

def split_text(text, max_length=500):
    """Split text into chunks of max_length characters."""
    return [text[i:i + max_length] for i in range(0, len(text), max_length)]

def generate_voice(text, output_path, speaker):
    try:
        print(f"🔹 Generating voice for text: {text}")
        print(f"🔹 Using speaker: {speaker}")

        # ✅ Load the Hugging Face TTS model
        model_id = '11mlabs/indri-0.1-124m-tts'
        task = 'indri-tts'

        # Use GPU if available
        device = "cuda:0" if torch.cuda.is_available() else "cpu"
        print(f"🔹 Using device: {device}")

        pipe = pipeline(
            task,
            model=model_id,
            device=device,
            trust_remote_code=True
        )

        # ✅ Split the text into chunks
        text_chunks = split_text(text)

        # ✅ Generate audio for each chunk
        audio_chunks = []
        for i, chunk in enumerate(text_chunks):
            print(f"🔹 Processing chunk {i + 1}/{len(text_chunks)}")
            output = pipe([chunk], speaker=speaker)
            audio_np = output[0]['audio'][0].cpu().numpy()
            audio_chunks.append(audio_np)

        # ✅ Combine all audio chunks into a single file
        combined_audio = np.concatenate(audio_chunks)
        torchaudio.save(output_path, torch.from_numpy(combined_audio), 24000)

        print(f"✅ Voice file saved at: {output_path}")

    except Exception as e:
        print(f"❌ Error generating voice: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("❌ Usage: python generate_voice_hf.py <text> <output_path> <speaker>", file=sys.stderr)
        sys.exit(1)

    text_input = sys.argv[1]
    output_file_path = sys.argv[2]
    speaker = sys.argv[3]

    generate_voice(text_input, output_file_path, speaker)