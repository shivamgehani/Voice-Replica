import sys
import torch
from torch.serialization import add_safe_globals
from TTS.api import TTS
from TTS.tts.configs.xtts_config import XttsConfig
from TTS.tts.models.xtts import XttsAudioConfig

# ✅ Allow required global classes for safe deserialization
add_safe_globals([XttsConfig, XttsAudioConfig])

def generate_voice(text, output_path, speaker_wav):
    try:
        print(f"🔹 Generating voice for text: {text}")
        print(f"🔹 Using speaker WAV file: {speaker_wav}")

        # ✅ Load the XTTS model
        tts = TTS(
            model_name="tts_models/multilingual/multi-dataset/xtts_v2",
            progress_bar=False,
            gpu=False
        )

        # ✅ Generate and save the voice file
        tts.tts_to_file(
            text=text,
            file_path=output_path,
            speaker_wav=speaker_wav,  # User's uploaded voice
            language="en"
        )

        print(f"✅ Voice file saved at: {output_path}")

    except Exception as e:
        print(f"❌ Error generating voice: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("❌ Usage: python generate_voice.py <text> <output_path> <speaker_wav>", file=sys.stderr)
        sys.exit(1)

    text_input = sys.argv[1]
    output_file_path = sys.argv[2]
    speaker_wav_path = sys.argv[3]

    generate_voice(text_input, output_file_path, speaker_wav_path)
