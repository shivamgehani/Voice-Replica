import sys
import requests
import base64

# Zonos API configuration
ZONOS_API_URL = "http://api.zyphra.com/v1/audio/text-to-speech"
ZONOS_API_KEY = "zsk-f77b319e6b7f5af27bfd273659e30e2027f84cc9d46f6098b748b4d621def25f"

def generate_voice(text, output_path, language="en-us", speaker_audio_path=None):
    try:
        print(f"🔹 Generating voice for text: {text}")
        print(f"🔹 Language: {language}")

        # Prepare the API request payload
        payload = {
            "text": text,
            "language_iso_code": language,  # Use a valid language code
            "speaking_rate": 15,
            "model": "zonos-v0.1-transformer",
        }

        # Add speaker audio if provided
        if speaker_audio_path:
            with open(speaker_audio_path, "rb") as audio_file:
                audio_base64 = base64.b64encode(audio_file.read()).decode("utf-8")
                payload["speaker_audio"] = audio_base64
            print(f"🔹 Using speaker audio file: {speaker_audio_path}")

        # Send the request to Zonos API
        headers = {
            "X-API-Key": ZONOS_API_KEY,
            "Content-Type": "application/json",
        }
        response = requests.post(ZONOS_API_URL, json=payload, headers=headers)

        if response.status_code != 200:
            raise Exception(f"Zonos API Error: {response.status_code} - {response.text}")

        # Save the generated audio file
        with open(output_path, "wb") as f:
            f.write(response.content)

        print(f"✅ Voice file saved at: {output_path}")

    except Exception as e:
        print(f"❌ Error generating voice: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("❌ Usage: python generate_voice_zonos.py <text> <output_path> [language] [speaker_audio_path]", file=sys.stderr)
        sys.exit(1)

    text_input = sys.argv[1]
    output_file_path = sys.argv[2]
    language_input = sys.argv[3] if len(sys.argv) > 3 else "en-us"  # Default to "en-us"
    speaker_audio_path = sys.argv[4] if len(sys.argv) > 4 else None

    generate_voice(text_input, output_file_path, language_input, speaker_audio_path)