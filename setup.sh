echo "=============================================="
echo "  Starting setup process, please wait..."
echo "=============================================="
# sudo add-apt-repository universe
# sudo apt update
# sudo apt install ffmpeg
python3 download_ffmpeg.py
python3 -m pip install -r requirements.txt
mkdir -p static/data
echo "=============================================="
echo "  Setup Compeleted!"
echo "=============================================="
echo "To run FEVA, type:"
echo "    python3 feva.py"
echo " "
echo "Then go to your browser and load URL:"
echo "    http://localhost:8000"
echo "=============================================="

