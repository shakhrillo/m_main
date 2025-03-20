import re

def extract_salary_and_type(driver):
    salaryInfoAndJobType = driver.find_element("#salaryInfoAndJobType").text if driver.is_element_present("#salaryInfoAndJobType") else None
    
    if not salaryInfoAndJobType:
        return {
            'salaries': [],
            'job_types': []
        }
    
    salary_pattern = re.compile(r'\$[\d,]+(?: - \$[\d,]+)?')
    job_type_pattern = re.compile(r'(?i)\b(?:part-time|full-time|contract|temporary|internship)\b')
    
    salaries = salary_pattern.findall(salaryInfoAndJobType)
    job_types = job_type_pattern.findall(salaryInfoAndJobType)
    
    return {
        'salaries': salaries,
        'job_types': list(set(job_types))  # Remove duplicates
    }
