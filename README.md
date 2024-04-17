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

Using the LLM News Detector browser extension is easy. Just navigate to the page you'd like to check, then open the extension in the top right of Chrome and press the 'Is it fake news?' button.

## Other Scholarly Articles

[Improving Language Understanding by Generative Pre-Training](https://s3-us-west-2.amazonaws.com/openai-assets/research-covers/language-unsupervised/language_understanding_paper.pdf)  
This article showed that language models can be improved by first performing generative pre-training on an unlabeled dataset, and then performing supervised fine-tuning on the model. Grover built on this article by creating a model that not only detects, but also generates fake news articles.

[Faking Fake News for Real Fake News Detection: Propaganda-loaded Training Data Generation](https://arxiv.org/pdf/2203.05386.pdf)  
This article builds on the Grover paper's idea of using neural models to detect fake news; however, this paper focuses more on detecting human-written fake news. The authors of this paper developed a way to generate fake news articles that use explicit propaganda techniques, and then created a dataset of articles generated in such a way. Fake news detectors which are trained on this dataset are better at detecting human-written fake news.

## Credits

This project builds on the work of Zellers et al. in [Defending Against Neural Fake News](https://arxiv.org/pdf/1905.12616.pdf)
