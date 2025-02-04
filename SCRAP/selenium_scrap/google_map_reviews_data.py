from selenium_scrap.google_map_reviews import google_map_reviews

async def google_map_reviews_data(driver, urls):
    all_messages = []
    for url in urls:
        messages = await google_map_reviews(driver, url)

        for message in messages:
            all_messages.append(message)

    return all_messages