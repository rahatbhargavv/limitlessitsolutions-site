# Deployment: GitHub -> Cloudflare Pages -> custom domain

## 1. Push to GitHub
Create a new repo under the `roco-190` account and push this folder (the Shelby assistant will do this once logged in as `roco-190`, or run: `git remote add origin https://github.com/roco-190/<repo>.git && git push -u origin main`).

## 2. Cloudflare Pages (free)
1. Go to dash.cloudflare.com and sign up or log in.
2. Left menu: **Workers & Pages** -> **Create** -> **Pages** -> **Connect to Git**.
3. Authorize GitHub, choose the repo, click **Begin setup**.
4. Framework preset: **None**. Build command: `node build.mjs`. Build output directory: `dist`.
5. Environment variable: `NODE_VERSION` = `20`.
6. Click **Save and Deploy**. You get a `*.pages.dev` address to test on.

## 3. Form email (Web3Forms, free)
1. Go to web3forms.com, enter `rahat.bhargav19@outlook.com`, click **Create Access Key**.
2. The key arrives by email. Put it in `site.config.mjs` as `web3formsKey`. (It is a public key by design; it is not a secret.)
3. Rebuild, push, then submit a real test on the live site and confirm the email arrives (also check Junk).
4. Customer auto-confirmation email and file uploads are paid (Pro) Web3Forms features. Without Pro, the thank-you screen confirms on-screen only and the photo is ignored. Decide if you want to upgrade.

## 4. Custom domain
1. In the Pages project: **Custom domains** -> **Set up a custom domain** -> `limitlessitsolutions.ca`.
2. Easiest: move DNS to Cloudflare. Add the site in Cloudflare, copy the two nameservers it gives you, and paste them at your domain registrar. If the registrar is CIRA-accredited, this is under "Nameservers".
3. Add `www.limitlessitsolutions.ca` too, and set a redirect to the main address.
4. HTTPS is issued automatically (can take a few minutes up to a few hours).
5. Turn on **SSL/TLS -> Always Use HTTPS**.

## 5. After launch
Submit `https://limitlessitsolutions.ca/sitemap.xml` in Google Search Console and Bing Webmaster Tools.
