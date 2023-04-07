
# SiteAnalyzer

SiteAnalyzer is a Python tool that helps you analyze the color contrast and speed of websites, taking into account both light and dark themes. The tool follows the Web Content Accessibility Guidelines (WCAG) 2.1 AA level requirements for color contrast and suggests alternative colors when the contrast ratio is not met. It also checks for large text contrast ratios and provides color suggestions for dark themes when needed. Additionally, SiteAnalyzer measures the First Contentful Paint (FCP) and site speed using the Playwright library.

![Screenshot of the client](https://github.com/LinuxDevil/site-analyzer/blob/main/screenshots/1.png?raw=true)

## Features

-   Analyzes color contrast of websites based on WCAG 2.1 AA level requirements
-   Supports light and dark themes (including the `prefers-color-scheme` CSS media feature)
-   Suggests alternative colors for improved contrast
-   Handles rgba and transparent color values
-   Checks for large text contrast ratios
-   Provides color suggestions for dark themes
-   Measures First Contentful Paint (FCP) and site speed

## Installation

1.  Install the required Python libraries using the following command:


`pip install requests beautifulsoup4 cssutils pillow colour playwright` 

2.  Install Playwright browsers using the following command:


`playwright install` 

3.  Download the SiteAnalyzer Python script from this repository.


4. CD into the js folder and run the following command:

`npm install`

## Usage SiteAnalyzer

1.  Run the SiteAnalyzer script using the following command:


`python speed_analyzer.py`


2.  When prompted, enter the URL of the website you want to analyze. The script will then analyze the site's FCP and site speed, providing suggestions if necessary.

## Usage ColorAnalyzer

1. Run the ColorAnalyzer script using the following command:

`python color_analyzer.py`

2. When prompted, enter the URL of the website you want to analyze. The script will then analyze the site's color contrast, providing suggestions if necessary.

## API

1. Install the required Python libraries using the following command:

`pip install fastapi uvicorn`

2. Run the API using the following command:

`uvicorn api:app --reload`

## Client App

1. Install the required npm libraries using the following command:

`npm install`

2. Run the client app using the following command:

`npm start`

## License

SiteAnalyzer is released under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for bug reports or feature requests.

## Support

If you encounter any issues or have questions, please open an issue on this repository.