# Import TTS
from TTS.api import TTS


# Initialize the TTS model (Tacotron2 + HiFi-GAN)
tts = TTS(model_name="tts_models/en/ljspeech/tacotron2-DDC", progress_bar=False, gpu=False)

# Text to be converted to speech
text = "Hello! Welcome to the world of Text-to-Speech using the TTS library."

# Convert the text to speech and save it as an audio file
tts.tts_to_file(text=text, file_path="ljspeechdataset.wav")