from urllib.parse import urlparse, parse_qs, urlencode, urlunparse

def change_language_in_url(url, lang_code):
    # Parse the URL
    parsed_url = urlparse(url)
    
    # Parse the query parameters
    query_params = parse_qs(parsed_url.query)
    
    # Change the language parameter
    query_params['hl'] = lang_code
    
    # Encode the query parameters back to a query string
    new_query = urlencode(query_params, doseq=True)
    
    # Reconstruct the URL with the new query string
    new_url = urlunparse((
        parsed_url.scheme,
        parsed_url.netloc,
        parsed_url.path,
        parsed_url.params,
        new_query,
        parsed_url.fragment
    ))
    
    return new_url