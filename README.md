# Sara & Leon: wedding invitation

Static site (no build step). Deploy the folder to Vercel as is.

| File | What it is |
|---|---|
| `index.html` | The invitation. Edit the `CONFIG` block at the top of the script for times, date, deadline, music and video. |
| `links.html` | Private page for making personal invitation links (`/links.html`). Not linked from the invitation. |
| `muzika.mp3` | Music that starts when the envelope is opened. Replace it with the couple's song, keeping the same name, and update `musicCredit`. |
| `restoranti.mp4` | Video shown in the restaurant section (plays muted and on a loop while on screen). If the file is missing, the video frame is hidden. |
| `ftesa.png` | The inner card: cream paper with the wine seal and the lace glove, cut out so the velvet page shows around it. The invitation text is laid over the paper. |
| `google-apps-script.gs` | Backend that writes RSVPs into a Google Sheet. |

## 1. Set up the RSVP sheet (about 5 minutes)

1. Make a new Google Sheet, e.g. "Dasma Sara & Leon – Konfirmimet".
2. **Extensions → Apps Script**. Replace the code with the contents of `google-apps-script.gs` and save.
3. Choose the `setup` function and click **Run**. Accept the permissions. This creates the *Konfirmimet* and *Përmbledhje* sheets.
4. **Deploy → New deployment → Web app**. Set *Execute as: Me* and *Who has access: Anyone*, then **Deploy**.
5. Copy the `https://script.google.com/macros/s/…/exec` URL into `rsvpEndpoint` in `index.html`.
6. Share the Google Sheet with Sara:
   - **Konfirmimet** has one row per answer: invitation name, the name typed in, whether they're coming (Po/Jo), and their message.
   - **Përmbledhje** has the number of Po and Jo answers.

If the same invitation answers again, its row is updated instead of being added twice.

## 2. Make personal links (optional)

Open `https://<your-site>/links.html` and enter a name (e.g. *Familja Krasniqi*), then press **Kopjo** or **WhatsApp**. The name shows on the envelope and on the card. The plain site URL also works for everyone.
