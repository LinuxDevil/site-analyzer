import requests
from bs4 import BeautifulSoup
import cssutils
from PIL import ImageColor
from typing import Tuple
from colour import Color
import colorsys
import re
import os

errors = []

def contrast_ratio(color1: Tuple[int, int, int], color2: Tuple[int, int, int]) -> float:
    l1 = (0.2126 * color1[0] + 0.7152 * color1[1] + 0.0722 * color1[2]) / 255
    l2 = (0.2126 * color2[0] + 0.7152 * color2[1] + 0.0722 * color2[2]) / 255

    if l1 > l2:
        return (l1 + 0.05) / (l2 + 0.05)
    else:
        return (l2 + 0.05) / (l1 + 0.05)


def get_styles(url: str) -> cssutils.css.CSSStyleSheet:
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')

    # Find inline styles and external stylesheets
    inline_css = soup.find_all('style')
    external_css = soup.find_all('link', rel='stylesheet')

    parser = cssutils.CSSParser()
    sheet = parser.parseString(''.join([c.string for c in inline_css]))

    # Fetch and parse external stylesheets
    for link in external_css:
        css_url = link['href']
        if not css_url.startswith('http'):
            css_url = requests.compat.urljoin(url, css_url)
        css_response = requests.get(css_url)
        external_sheet = parser.parseString(css_response.text)
        for rule in external_sheet:
            sheet.add(rule)

    return sheet, soup


def lighten(color_rgb, amount=0.1):
    r, g, b = color_rgb
    h, l, s = colorsys.rgb_to_hls(r / 255.0, g / 255.0, b / 255.0)
    l = min(l + amount, 1)
    r, g, b = colorsys.hls_to_rgb(h, l, s)
    return int(r * 255), int(g * 255), int(b * 255)


def darken(color_rgb, amount=0.1):
    r, g, b = color_rgb
    h, l, s = colorsys.rgb_to_hls(r / 255.0, g / 255.0, b / 255.0)
    l = max(l - amount, 0)
    r, g, b = colorsys.hls_to_rgb(h, l, s)
    return int(r * 255), int(g * 255), int(b * 255)


def suggest_color(original_color_rgb, target_contrast_ratio):
    suggested_color_rgb = original_color_rgb

    for _ in range(20):  # Limit the number of iterations
        luminance = (0.2126 * suggested_color_rgb[0] + 0.7152 * suggested_color_rgb[1] + 0.0722 * suggested_color_rgb[2]) / 255
        suggested_color_rgb = darken(suggested_color_rgb, 0.1) if luminance > 0.5 else lighten(suggested_color_rgb, 0.1)

        ratio = contrast_ratio(original_color_rgb, suggested_color_rgb)
        if ratio >= target_contrast_ratio:
            break

    return '#%02x%02x%02x' % suggested_color_rgb


def analyze_site_colors(url: str):
    sheet, soup = get_styles(url)
    dark_theme_present = False

    def get_inherited_color(element, property_name):
        while element:
            inline_style = element.get('style')
            if inline_style:
                inline_rules = cssutils.parseStyle(inline_style)
                value = inline_rules.getPropertyValue(property_name)
                if value and value.lower() != "inherit":
                    return value
            element = element.parent
        return None


    def rgba_to_rgb(rgba_string):
        rgba_pattern = re.compile(r'^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)$')
        match = rgba_pattern.match(rgba_string)
        if match:
            r, g, b, a = map(float, match.groups())
            return int(r * a + 255 * (1 - a)), int(g * a + 255 * (1 - a)), int(b * a + 255 * (1 - a))
        return None



    def check_and_suggest_color(style, contrast_ratio_threshold, text_type, selector):
        bg_color = style.getPropertyValue('background-color')
        color = style.getPropertyValue('color')

        if bg_color.lower() == "transparent"  or color.lower() == "transparent":
            return  # Skip checking contrast ratio for transparent colors

        if bg_color.lower() == "none"  or color.lower() == "none":
            return  # Skip checking contrast ratio for transparent colors


        if bg_color.lower() == "inherit" or color.lower() == "inherit":
            elements = soup.select(selector)
            for element in elements:
                if bg_color and bg_color.lower() == "inherit":
                    bg_color = get_inherited_color(element, 'background-color')
                if color and color.lower() == "inherit":
                    color = get_inherited_color(element, 'color')
                

        elif bg_color and color:
            if 'rgba(' in bg_color.lower():
                bg_color_rgb = rgba_to_rgb(bg_color)
            else:
                bg_color_rgb = ImageColor.getrgb(bg_color)
            if 'rgba(' in color.lower():
                color_rgb = rgba_to_rgb(color)
            else:
                color_rgb = ImageColor.getrgb(color)


            ratio = contrast_ratio(bg_color_rgb, color_rgb)
            if ratio >= contrast_ratio_threshold:
                print(f"{text_type} contrast: pass")
            else:
                suggested_color = suggest_color(color_rgb, contrast_ratio_threshold)
                print(f"{text_type} contrast: Failed. Contrast ratio: {ratio:.2f}. Consider using {suggested_color} for better contrast.")
                errors.append(f"In selector: f{selector}, the {text_type} contrast: Failed. Contrast ratio: {ratio:.2f}. Consider using {suggested_color} for better contrast.")

    for rule in sheet:
        if isinstance(rule, cssutils.css.CSSMediaRule) and 'prefers-color-scheme: dark' in rule.media.mediaText:
            if ':before' in rule.selectorText or ':after' in rule.selectorText:
                continue  # Skip unsupported pseudo-elements
            dark_theme_present = True
            for nested_rule in rule.cssRules:
                if isinstance(nested_rule, cssutils.css.CSSStyleRule):
                    if ':before' in rule.selectorText or ':after' in rule.selectorText:
                        continue  # Skip unsupported pseudo-elements
                    style = nested_rule.style

                    # Check color contrast for normal text
                    check_and_suggest_color(style, 4.5, "Dark theme normal text", rule.selectorText)

                    # Check color contrast for large text
                    check_and_suggest_color(style, 3, "Dark theme large text", rule.selectorText)

        elif isinstance(rule, cssutils.css.CSSStyleRule):
            if ':before' in rule.selectorText or ':after' in rule.selectorText:
                continue  # Skip unsupported pseudo-elements

            # Check color contrast for light theme or no theme specified
            style = rule.style

            # Check color contrast for normal text
            check_and_suggest_color(style, 4.5, "Light theme normal text", rule.selectorText)

            # Check color contrast for large text
            check_and_suggest_color(style, 3, "Light theme large text", rule.selectorText)

    if not dark_theme_present:
        print("Dark theme not detected. Consider adding a dark theme with appropriate color contrast.")
        errors.append("Dark theme not detected. Consider adding a dark theme with appropriate color contrast.")


if __name__ == "__main__":
    url = input("Enter the URL: ")
    analyze_site_colors(url)
    with open('errors.txt', 'w') as f:
        for error in errors:
            f.write(error + "\n")


def anaylyze_and_save_report(url: str):
    analyze_site_colors(url)
    file_name = 'errors.txt'
    file_path = os.path.join(os.getcwd(), file_name)

    with open(file_name, 'w') as f:
        for error in errors:
            f.write(error + "\n")

    return file_path