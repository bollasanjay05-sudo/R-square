# R Square Consulting & Tourism Website

Static multi-page staffing and HR outsourcing website inspired by the bold editorial style of afternow.co.

## Pages
- `index.html` - main landing page
- `services.html` - staffing, payroll, remote employees, outstaffing and relocation
- `work.html` - recruitment services
- `insights.html` - specializations
- `about.html` - why us
- `contact.html` - consultant contact form

## Preview
From this folder, serve the site with any static web server:

```powershell
python -m http.server 8080
```

Then open:

```text
http://127.0.0.1:8080/
```

The contact form validates required fields and shows an on-page success message. It does not send email until connected to a backend or form service.
