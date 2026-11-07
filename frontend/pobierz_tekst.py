import requests
from bs4 import BeautifulSoup
    
    
def pobierz_tekst_ze_strony(url: str) -> str:
    """Pobiera stronę WWW i zwraca jej zawartość tekstową bez tagów HTML i skryptów."""
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
    }

    response = requests.get(url, headers=headers, timeout=10)
    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")

    # Usunięcie elementów niewidocznych / niebędących treścią
    for element in soup(["script", "style", "noscript"]):
        element.decompose()

    # Wyciągnięcie tekstu, rozdzielenie linii i usunięcie zbędnych spacji
    return soup.get_text(separator="\n", strip=True)


if __name__ == "__main__":
    adres_url = "https://example.com"
    try:
        tekst = pobierz_tekst_ze_strony(adres_url)
        print(tekst)
    except requests.RequestException as e:
        print(f"Błąd podczas pobierania strony: {e}")