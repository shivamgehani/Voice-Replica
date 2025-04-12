import IPython
import torch
import matplotlib.pyplot as plt  # Ensure plt is imported

from model import TransformerTTS
from melspecs import inverse_mel_spec_to_wav
from write_mp3 import write_mp3

# Set device to CPU since CUDA is unavailable
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load model checkpoint with correct device mapping
train_saved_path = "C:/Users/Shivam gehani/Desktop/EAD Projects/train.pt"
state = torch.load(train_saved_path, map_location=device)

# Initialize and load the model onto the correct device
model = TransformerTTS().to(device)
model.load_state_dict(state["model"])

text = "Hello, World."
name_file = "hello_world.mp3"

# Move tensors to the correct device
postnet_mel, gate = model.inference(
    text_to_seq(text).unsqueeze(0).to(device),  # Changed from .cuda() to .to(device)
    gate_threshold=1e-5,
    with_tqdm=False
)

# Convert mel spectrogram to audio
audio = inverse_mel_spec_to_wav(postnet_mel.detach().cpu()[0].T)

# Plot the gate activation
plt.plot(
    torch.sigmoid(gate[0, :]).detach().cpu().numpy()
)

# Save generated audio
write_mp3(
    audio.detach().cpu().numpy(),
    name_file
)

# Play the audio
IPython.display.Audio(
    audio.detach().cpu().numpy(),
    rate=hp.sr
)
