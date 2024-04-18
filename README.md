# LLM News Detector
*A Chrome extension that allows users to check whether internet news articles were written by humans or AI.*

## Installation

Steps: 
1. Download this repo.
2. In Chrome, visit [chrome://extensions/](chrome://extensions/).
3. In the top right corner of the screen, toggle the switch to enable developer mode.
4. Click the 'Load unpacked' button in the top left of the screen.
5. Navigate to the folder where you saved the downloaded code. (Note that if you downloaded it as a zip, you'll have to extract it to a folder). Select the groverbrowserextension folder.

## How to Use

Once you've downloaded the extension, navigate to the page you'd like to check. When you have that open, click on the extension on the top right of Chrome and press the 'Is this human-written?' button. Pressing the button will then print out a message regarding how sure the model is that the text received is human-written or machine-written.

#### Known Limitations  
Some articles will return false positives. This is due to inconsistencies in how different news sites format their articles. Here is a list of sites that are known to not work with the LLM News Detector:
- AP News
- Reuters
- USA Today
- Axios
- NPR
- Al Jazeera
- Forbes
- PBS


## Other Scholarly Articles

##### Improving Language Understanding by Generative Pre-Training (2018)
*A. Radford, K. Narasimhan, T. Salimans, I. Sutskever*  
[Link](https://s3-us-west-2.amazonaws.com/openai-assets/research-covers/language-unsupervised/language_understanding_paper.pdf)  
This article showed that language models can be improved by first performing generative pre-training on an unlabeled dataset, and then performing supervised fine-tuning on the model. Grover built on this article by creating a model that not only detects, but also generates fake news articles.

##### Faking Fake News for Real Fake News Detection: Propaganda-loaded Training Data Generation (2023)
*K.H. Huang, K. McKeown, P. Nakov, Y. Choi, H. Ji*  
[Link](https://arxiv.org/abs/2203.05386)  
This article builds on the Grover paper's idea of using neural models to detect fake news; however, this paper focuses more on detecting human-written fake news. The authors of this paper developed a way to generate fake news articles that use explicit propaganda techniques, and then created a dataset of articles generated in such a way. Fake news detectors which are trained on this dataset are better at detecting human-written fake news.

## Credits

LLM News Detector was created by Arely Gutierrez Carbajal, Nil Ceylan, Shawn Spicer, Shelby Cumings, and Michael Lehmann.

This project builds on the work of Zellers et al. in *Defending Against Neural Fake News* (2019).
[Link](https://arxiv.org/abs/1905.12616)

