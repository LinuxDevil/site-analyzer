import os
import json
import subprocess

def measure_lighthouse_report(url):
    subprocess.run(["node", "js/lighthouse_report.js", url])

    with open("report.json", "r") as file:
        report = json.load(file)

    fcp = report["audits"]["first-contentful-paint"]["displayValue"]
    speed_index = report["audits"]["speed-index"]["displayValue"]
    best_practices = report["categories"]["best-practices"]["score"] * 100

    print(f"First Contentful Paint (FCP): {fcp}")
    print(f"Site speed: {speed_index}")
    print(f"Best practices: {best_practices:.2f}%")

    os.remove("report.json")

if __name__ == "__main__":
    url = input("Enter the URL: ")
    measure_lighthouse_report(url)
