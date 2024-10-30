export default function Blizzard() {
  const [accessToken, setAccessToken] = useState(null);
  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
  const clientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET;
  const urlToken = "https://oauth.battle.net/token";
  const basicAuth = "Basic " + btoa(`${clientId}:${clientSecret}`);
  const dataBody = {
    grant_type: "client_credentials",
  };

  async function getAccessToken() {
    try {
      const response = await fetch(urlToken, {
        method: "POST",
        headers: {
          Authorization: basicAuth,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(dataBody).toString(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response body:", errorText);
        return null;
      }

      const result = await response.json();

      setAccessToken(result.access_token);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getAccessToken();
  }, []);
}
