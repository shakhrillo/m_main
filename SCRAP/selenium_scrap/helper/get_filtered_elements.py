def get_filtered_elements(driver, by, value, attribute, attribute_value):
    elements = driver.find_elements(by, value)
    return [e for e in elements if e.get_attribute(attribute) is not None and attribute_value in e.get_attribute(attribute)]