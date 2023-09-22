import requests
import platform
import os

# Linux: Linux, Mac: Darwin, Windows: Windows
current_OS = platform.system()

response = requests.get("https://ffbinaries.com/api/v1/version/latest")
if not response.status_code == 200:
    print("ERROR: URL not found. Please try again later.")
    exit()
    
data = response.json()['bin']


# WINDOWS
if current_OS == "Windows":
    files = data['windows-64']
#MAC
elif current_OS == 'Darwin':
    files = data['osx-64']
# LINUX (ignoring linux-32)
elif current_OS == 'Linux':
    files = data['linux-64']
else:
    print("ERROR: Unknown/ Unsupported OS")
    exit()
    
ffmpeg_url = files['ffmpeg']
ffprobe_url = files['ffprobe']

def download_file(url):
    response = requests.get(url)
    filename = url[url.rfind('/')+1:]
    
    # download
    open(filename, "wb").write(response.content)
    
    # unzip
    os.system('unzip -o ' + filename)
    
    # remove zip
    os.remove(filename)
    
    # set execution permissions
    os.system('chmod 777 ' + filename[:filename.find('-')])
    
download_file(ffmpeg_url)
download_file(ffprobe_url)



