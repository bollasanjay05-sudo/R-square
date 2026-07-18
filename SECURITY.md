# R Square website security baseline

This repository currently contains a static marketing website. It has no server-side AI model, authentication, customer accounts, database, file uploads, administrator panel, payment processing or native form-storage endpoint.

No website can be guaranteed to be completely secure. The controls below reduce risk and define the minimum work required before adding dynamic or AI-powered functionality.

## Implemented in this version

- All scripts, styles, fonts, images and the logo are local; no third-party JavaScript is loaded.
- A restrictive Content Security Policy is included as an HTML fallback.
- `_headers` supplies the stronger HTTP response-header policy for compatible static hosts such as Netlify or Cloudflare Pages.
- Browser framing, MIME sniffing, referrer leakage, unnecessary device APIs, external connections, objects, workers and native form actions are restricted.
- Form fields have explicit type and length limits.
- Required checkbox state is validated correctly.
- Control characters are removed and values are capped again before building the WhatsApp message.
- WhatsApp is the only allow-listed message destination. The visitor must review and manually send the message in WhatsApp.
- WhatsApp delivery is restricted to the company-provided UAE business number.
- Generic translations are inserted as text, not HTML. Only four internal, fixed heading translations are allowed to contain `<br>` and `<em>` markup.
- The site does not store enquiry data in a local database or send it to an AI provider.
- A public Privacy Notice and Website Terms page are included.

## Required configuration before launch

1. Confirm that the company-provided WhatsApp number, phone numbers, `info@rsquare.lv`, legal name, registration number and address remain current before launch.
2. Have Latvian/EU counsel review the Privacy Notice, legal bases, international-transfer wording, retention period and Website Terms.
3. Host only through HTTPS. Confirm all subdomains support HTTPS before enabling the included HSTS `includeSubDomains` setting.
4. Confirm that the production host actually applies `_headers`. If it does not, configure the same headers in the CDN, reverse proxy or web server.
5. Run the production site through a CSP evaluator, security-header scanner, link checker and independent vulnerability assessment.
6. Create an operational process to answer data-subject requests and delete stale enquiries within the stated retention period.
7. Establish incident-response, backup, monitoring and breach-notification procedures appropriate to the deployed services.

## If a backend, login, uploads, payments or AI are added

Do not treat the current static controls as sufficient. Before release:

- enforce authentication and deny-by-default authorization on the server for every request;
- use administrator MFA and separate privileged accounts;
- isolate each customer or tenant and test cross-account access;
- store secrets only in a managed server-side secret store;
- use secure, HttpOnly, SameSite cookies and regenerate sessions after login;
- rate-limit authentication, APIs, forms and AI/tool calls;
- validate server inputs with strict schemas and use parameterized database queries;
- scan uploads by signature and malware, rename them randomly, and process them in isolation outside the executable web root;
- treat prompts, retrieved pages, uploaded documents and tool results as untrusted;
- give AI only allow-listed, least-privilege tools and validate every tool parameter in server code;
- never let AI decide authentication, authorization, destructive actions, payments or record access;
- escape AI output before display and never directly execute AI-generated SQL, shell, JavaScript, URLs or file paths;
- require human confirmation before messages, publishing, purchases, account changes or deletion;
- use a hosted/tokenised payment provider rather than handling card data;
- implement protected, tamper-resistant security logging without passwords, tokens or unnecessary personal data;
- complete OWASP ASVS Level 2 and relevant OWASP LLM/AISVS verification, abuse tests and independent penetration testing.

## Primary references

- OWASP Secure Headers Project: https://owasp.org/www-project-secure-headers/
- OWASP Content Security Policy Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html
- OWASP ASVS: https://owasp.org/www-project-application-security-verification-standard/
- OWASP LLM Top 10: https://owasp.org/www-project-top-10-for-large-language-model-applications/
- European Commission data-protection guidance: https://commission.europa.eu/law/law-topic/data-protection/data-protection-explained_en
