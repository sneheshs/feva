# FEVA

Fast Event Video Annotation, FEVA, is a video annotation tool with streamlined interaction techniques and a dynamic interface that makes labeling tasks easy and fast. FEVA focuses on speed, accuracy, and simplicity to make annotation quick, consistent, and straightforward.

Details of the tool, design choices, and comparison with other tools are in our [Paper on Arxiv](https://arxiv.org/abs/2301.00482)


![Feva](https://www.snehesh.com/wp-content/uploads/2022/12/FEVA.png)

### Description:

Video Annotation is a crucial process in computer science and social science alike. Many video annotation tools (VATs) offer a wide range of features for making annotation possible. We conducted an extensive survey of over 59 VATs and interviewed interdisciplinary researchers to evaluate the usability of VATs. Our findings suggest that most current VATs have overwhelming user interfaces, poor interaction techniques, and difficult-to-understand features. These often lead to longer annotation time, label inconsistencies, and user fatigue. We introduce FEVA, a video annotation tool with streamlined interaction techniques and a dynamic interface that makes labeling tasks easy and fast. FEVA focuses on speed, accuracy, and simplicity to make annotation quick, consistent, and straightforward. For example, annotators can control the speed and direction of the video and mark the onset and the offset of a label in real time with single key presses. In our user study, FEVA users, on average, require 36% less interaction than the most popular annotation tools (Advene, ANVIL, ELAN, VIA, and VIAN). The participants (N=32) rated FEVA as more intuitive and required less mental demand. You can learn more about the FEVA in our website [https://www.snehesh.com/feva](https://www.snehesh.com/feva).


### Prerequisite:

1. `Python 3.5.x or later` : Tested and verified. While this code should work with any Python version, some dependencies packages may break compatibility. Please file an issue if you find that FEVA has issues running with a particular python version.

2. `Windows`, `Mac` and `Ubuntu`: Tested and verified. While it should work with any system that can run python (specifically `Flask` package) and runs `Chrome` browser, FEVA should run. If you have any issues, please file an issue or do a pull request with a fix.

3. FEVA only supports `Google Chrome` browser. I tested it with Firefox and Safari a couple of times and they do not work well.


### Installation:

This installation assumes that you have all the prerequisite requirements met.
1. Clone this repo.
2. Then from your `terminal` (`command prompt` on Windows), go into the repo folder `cd feva`
3. On Ubuntu or Macs, run `setup.sh` (This will download `ffmpeg`, install python dependency packages, and creates needed folders)

If all of these run without any errors, your FEVA is ready to use.


### Usage:

1. To run FEVA, type `python3 feva.py`
2. Then go to your browser and load URL: http://localhost:8000 (If your computer has the port `8000` firewalled, you can specify the `port` number when starting FEVA, here is an example with `port` as `5000`: `python feva.py --port 5000`. Then you'd load http://localhost:5000.


## Tutorial

You can watch a quick start guide video here: Coming soon.


