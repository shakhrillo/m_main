from datetime import datetime

def ago_to_time(ago):
  # Create a list with years ago and months ago values
  times_ago = [
    ("years", 5),
    ("months", 11),
    ("years", 1),
    ("years", 5),
    ("years", 9),
    ("years", 6)
  ]

  # Get current date
  current_date = datetime.now()

  # Calculate the actual dates
  actual_dates = []
  for unit, value in times_ago:
    if unit == "years":
      actual_dates.append(current_date.replace(year=current_date.year - value))
    elif unit == "months":
      year = current_date.year
      month = current_date.month - value
      if month <= 0:
        month += 12
        year -= 1
      actual_dates.append(current_date.replace(year=year, month=month))

  # Output the dates
  for date in actual_dates:
    print(date.strftime("%B %d, %Y"))
    
    return date.strftime("%B %d, %Y")
  
  return None