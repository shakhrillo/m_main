import re

def extract_job_details(driver):
    job_details = driver.find_element("#jobDetailsSection").text if driver.is_element_present("#jobDetailsSection") else None

    if not job_details:
        return {
            "pay_range": None,
            "job_types": None,
            "shift_and_schedule": None,
            "work_setting": None
        }

    pay_match = re.search(r'Pay\n\$(\d{1,3}(?:,\d{3})*) - \$?(\d{1,3}(?:,\d{3})*)?', job_details)
    job_types = re.findall(r'Job type\n([^\n]+)', job_details)
    shift_match = re.search(r'Shift and schedule\n([^\n]+)', job_details)
    work_setting_match = re.search(r'Work setting\n([^\n]+)', job_details)

    return {
        "pay_range": pay_match.groups() if pay_match else None,
        "job_types": job_types if job_types else None,
        "shift_and_schedule": shift_match.group(1) if shift_match else None,
        "work_setting": work_setting_match.group(1) if work_setting_match else None
    }