// Fallback for requests that never reach a locale (rare: the middleware redirects to /fr)
export default function GlobalNotFound() {
  return (
    <html lang="fr">
      <body style={{ fontFamily: "system-ui", textAlign: "center", padding: "4rem 1rem" }}>
        <h1>404</h1>
        <a href="/fr">Clinique Metidja — accueil</a>
      </body>
    </html>
  );
}
