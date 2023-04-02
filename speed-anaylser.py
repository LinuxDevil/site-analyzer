import os
import json
import subprocess

def measure_lighthouse_report(url):
    # Run the Lighthouse Node.js script
    subprocess.run(["node", "node-app/lighthouse_report.js", url])

    # Read the Lighthouse JSON report
    with open("report.json", "r") as file:
        report = json.load(file)

    # Extract FCP, site speed, and best practices
    fcp = report["audits"]["first-contentful-paint"]["displayValue"]
    speed_index = report["audits"]["speed-index"]["displayValue"]
    best_practices = report["categories"]["best-practices"]["score"] * 100

    # Output results
    print(f"First Contentful Paint (FCP): {fcp}")
    print(f"Site speed: {speed_index}")
    print(f"Best practices: {best_practices:.2f}%")

    # Remove report file
    os.remove("report.json")

if __name__ == "__main__":
    url = input("Enter the URL: ")
    measure_lighthouse_report(url)
