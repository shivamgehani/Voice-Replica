import sys
from TTS.api import TTS

def generate_voice(text, output_path):
    try:
        print(f"🔹 Generating voice for text: {text}")

        # ✅ Initialize the TTS model (Tacotron2 + HiFi-GAN)
        tts = TTS(
            model_name="tts_models/en/ljspeech/tacotron2-DDC",
            progress_bar=False,
            gpu=False  # Set to True if GPU is available
        )

        # ✅ Convert text to speech and save the output file
        tts.tts_to_file(text=text, file_path=output_path)

        print(f"✅ Voice file saved at: {output_path}")

    except Exception as e:
        print(f"❌ Error generating voice: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("❌ Usage: python generate_voice_tacotron.py <text> <output_path>", file=sys.stderr)
        sys.exit(1)

    text_input = sys.argv[1]
    output_file_path = sys.argv[2]

    generate_voice(text_input, output_file_path)