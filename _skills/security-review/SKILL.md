---
name: security-review
description: Kombiniertes SAST+DAST Security-Review für lokale Webprojekte.
  Analysiert den Quellcode im aktuellen Arbeitsverzeichnis UND testet eine
  laufende Dev-Anwendung unter einer vom User angegebenen localhost-URL.
  Produziert einen strukturierten Markdown-Report mit verifizierten Findings.
  Use when the user says "security-review", "pentest", "security audit",
  "vulnerability check", or asks to audit a local web project against a
  localhost URL.
---

# Security Review Workflow

Du führst ein kombiniertes statisches (Code) und dynamisches (laufende App)
Security-Review durch. Die Zielanwendung läuft lokal; Code liegt im aktuellen
Arbeitsverzeichnis.

## Phase 0 — Scope-Bestätigung (PFLICHT, bevor irgendetwas anderes passiert)

Extrahiere aus der letzten User-Nachricht:
- Target-URL (z.B. "http://localhost:8080"). Wenn keine angegeben oder keine
  localhost/127.0.0.1/host.docker.internal/*.local/*.test URL: STOPP und
  nachfragen. Niemals gegen öffentliche URLs oder Produktions-Domains testen.
- Working directory = aktuelles Verzeichnis. Prüfe dass hier Code liegt
  (package.json, composer.json, .git o.ä.). Falls nicht: nachfragen.

Zeige dem User eine Scope-Zusammenfassung und frage EINMAL:
- "Getestet wird Code in <pwd> gegen <URL>. Korrekt?"
- "Gibt es einen Auth-geschützten Bereich? Wenn ja, bitte Test-Credentials
  (User/Passwort oder Login-Flow-Beschreibung). Wenn nein, teste nur
  unauthentifizierte Flächen."
- "Gibt es Bereiche die NICHT getestet werden sollen (Logout, Payment,
  E-Mail-Versand, destruktive Aktionen)?"

Warte auf Antwort. Erst dann weitermachen.

## Phase 1 — Browser-MCP identifizieren

Prüfe via `/mcp` (bzw. durch Inspektion verfügbarer Tools), ob ein Browser-MCP
verfügbar ist (`chrome`, `playwright`, o.ä.). Nutze den ersten gefundenen für
Phase 6-8. Falls keiner da: Phase 6-8 überspringen und im Report als
"DAST übersprungen, kein Browser-MCP verfügbar" markieren.

## Phase 2-5 — Statische Analyse (Quellcode)

Arbeite sequenziell ab, berichte nach jeder Phase einen 2-Zeilen-Zwischenstand:

2. **audit-context-building**: Architektur, Framework (Laravel, WordPress,
   Express, Next.js, …), Entry Points, Auth-Mechanismen, DB-Zugriffsmuster,
   Deployment-Artefakte. Outcome: mentales Modell der App.

3. **supply-chain-risk-auditor**: package.json, composer.json, requirements.txt
   etc. auf bekannte Schwachstellen, unmaintained Packages, typosquatting,
   übermäßige Permissions. Bei npm zusätzlich `npm audit --json` nutzen.

4. **static-analysis** + **semgrep**: Default-Rulesets passend zum erkannten
   Stack laufen lassen. Vor Übernahme in den Report jedes Finding
   verifizieren: ist der Input tatsächlich attacker-controlled? Gibt es
   vorgelagerte Sanitization? Kann der Codepfad real erreicht werden?
   Findings ohne Verifikation gehen nicht in den Report.

5. **insecure-defaults** + **sharp-edges**: hardcoded Credentials/API-Keys,
   Fallback-Secrets, Debug-Flags in .env/config, schwache Auth-Defaults,
   direktes HTML-Einfügen, unescaped Queries, unsichere Deserialisierung,
   SSRF-Vektoren, offene Redirect-Parameter.

## Phase 6-8 — Dynamische Analyse (laufende App)

Nur wenn Browser-MCP verfügbar UND User in Phase 0 bestätigt hat.

6. **Enumeration**: Crawle ab der Ziel-URL. Sammle Routes, Forms, API-
   Endpoints (inkl. die aus Phase 2 bekannten). Parallel: robots.txt,
   sitemap.xml, common paths (/admin, /api, /.env, /.git/config).

7. **Endpoint-Tests** für die wichtigsten Routes:
   - Security Headers (CSP, X-Frame-Options, X-Content-Type-Options, HSTS,
     Referrer-Policy) via HTTP-Response-Inspection
   - Cookie-Flags (HttpOnly, Secure, SameSite)
   - Reflected XSS (canary-Strings in Query-Parametern, dann DOM/Response
     prüfen)
   - Stored XSS (nur in Feldern wo Persistenz erwartbar und Test-Creds
     vorhanden)
   - SQLi-Indikatoren (Error-based, boolean-based auf unverdächtigen
     Feldern; KEIN blindes Payload-Spray)
   - IDOR: sofern authentifiziert, mit zweitem Account / unauthentifiziert
     versuchen, auf fremde Ressourcen-IDs zuzugreifen
   - CSRF: State-changing POST/PUT/DELETE ohne CSRF-Token/Origin-Check
   - Open Redirect auf Login-Redirect-Parametern

8. **Auth-Flow-Tests** (nur wenn User-Credentials vorhanden):
   - Brute-Force-Schutz (10 fehlerhafte Logins → Lockout? Rate-Limit?)
   - Session-Management (Cookie nach Logout invalidiert? Session-Fixation
     möglich?)
   - Password-Reset-Logik (Token-Stärke, Token-Wiederverwendung, User-
     Enumeration über Reset-Form)

Destruktive Aktionen (Account-Löschung, Daten-Mutation über das im Code
ersichtliche übliche Maß hinaus) sind NICHT erlaubt. Bei Unsicherheit:
nachfragen.

## Output

Erstelle im aktuellen Verzeichnis eine Datei `security-review-YYYY-MM-DD.md`
(echtes heutiges Datum einsetzen) mit folgender Struktur:

1. **Executive Summary** (2-3 Sätze: Anzahl Findings, kritischste Kategorie,
   Gesamt-Risikoeindruck)
2. **Scope** (geprüfter Code-Pfad, Target-URL, Phase-6-8 ausgeführt ja/nein,
   Auth-Tests ausgeführt ja/nein)
3. **Findings-Tabelle** sortiert nach Severity (Critical → High → Medium →
   Low → Info): | # | Severity | Titel | Kategorie | Stelle |
4. **Detail pro Finding**:
   - Beschreibung (was ist das Problem)
   - Betroffene Stelle (Datei:Zeile ODER URL + HTTP-Request)
   - Reproduction Path (genaue Schritte oder curl/HTTP-Request)
   - Impact (was kann ein Angreifer erreichen)
   - Empfehlung (konkrete Fix-Richtung, wenn trivial: Code-Diff)
   - Confidence (verified / likely / theoretical)
5. **Nicht geprüft / Einschränkungen** (bewusst ausgeschlossene Bereiche,
   übersprungene Phasen, bekannte Blindspots)

**Kein Finding ohne Beleg**: jedes Finding muss entweder auf einer konkreten
Code-Stelle fußen oder auf einer dynamisch beobachteten HTTP-Response.
Spekulative Findings gehen in einen separaten Abschnitt "Zu prüfen" ohne
Severity-Rating.

## Verhalten bei Unklarheiten

Lieber einmal nachfragen als raten. Bei Unsicherheit zu Scope, Auth oder
destruktiven Aktionen: anhalten und fragen.
