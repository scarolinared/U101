[README.txt](https://github.com/user-attachments/files/34806188/README.txt)
CAROLINA CLASSROOM CHALLENGE
University 101 • Five teams • 30 clues + one final

QUICKEST WAY TO PLAY — ONE SCREEN
1. Open Carolina_Trivia.html in Chrome, Edge, Firefox, or Safari on your computer.
2. Click “Play on one screen.”
3. Click each default team name to rename it, then click “Start the board.”
4. Share/project your screen. Teams choose clues and raise hands to buzz.
5. Click the answering team, then mark Correct or Incorrect. Other teams can steal.
6. Select Final Challenge when ready. Have teams write wagers and answers on paper.

The HTML is self-contained and works without internet (source links need internet).
The offline game saves progress in this browser if storage is available. The
host copy contains the answers; give students only the live game address.

PHONE PLAY — RUN THE INCLUDED SERVER
What you need: a computer with Node.js installed, and phones that can reach it.
Node.js is available at https://nodejs.org/ . No npm packages are required.

1. Extract this entire ZIP into a folder. Keep the files together.
2. Open a terminal in that folder.
   Windows: open the folder, type cmd in File Explorer’s address bar, press Enter.
   Mac: open Terminal, type cd followed by a space, drag the folder into Terminal,
   then press Return.
3. Run:
   node server.mjs
4. Keep that window open. Open http://localhost:3000 on the host computer.
5. Click “Host a live game.” The page shows a six-digit code.
6. Click “Set phone join address.” Paste the Wi-Fi address printed by the server,
   such as http://192.168.1.20:3000 . This updates the QR code and join link.
7. Connect team phones to the same Wi-Fi. One captain per team scans the QR,
   enters a nickname, and joins. Or open the same Wi-Fi address and enter the code.
8. When all teams appear, click “Start the board.”
9. Read a clue aloud, then click “Open buzzers.” First request received wins.
   The captain answers aloud; you judge. Incorrect teams cannot buzz again on
   that clue. Reopen buzzers for a steal, or choose a team manually.
10. For Final Challenge, captains submit private wagers. Reveal the clue,
    allow 60 seconds for private typed answers, then close and judge each answer.

IMPORTANT CONNECTION DETAILS
“localhost” points to the device using it. A phone needs the computer’s network
address, not localhost. You may need to allow Node.js through your computer’s
firewall for the classroom network. Campus guest Wi-Fi often blocks connections
between devices. Test with a real phone in the actual classroom before class.
If peer connections are blocked, ask campus IT about a permitted network or use
a public Node.js host. A QR code cannot bypass those network restrictions.

PUBLIC HOSTING
Public publishing from the originating ChatGPT workspace is disabled, so no
student-accessible internet link has been deployed. This ZIP is ready for a
Node.js web host that supports a long-running single server process.
Start command: node server.mjs
Use the platform-provided PORT environment variable (the server reads it).
Use one instance; room state is held in that instance’s memory. Do not deploy
this as a static-only site or short-lived serverless functions.
Serve over HTTPS for an internet deployment. On a public host, the displayed
origin is already the right join address; no Wi-Fi address is necessary.

ROOMS AND RECOVERY
Use team nicknames; no student emails or accounts are required. Max five teams.
Keep each captain’s tab and the host tab open. Credentials are remembered in
that browser tab’s session storage, so a refresh can reconnect. A new browser
or tab does not automatically recover a team. Teams can be removed while in
the lobby. Server restart clears all rooms; rooms also expire after 24 hours.
Screens may briefly show “Reconnecting” when the connection is interrupted.
Do not restart the server during a game. Offline and online sessions are separate.

RULES
- Clues are worth 100, 200, 300, 400, 500, or 600 points.
- Correct: add points. Incorrect: subtract points. Negative scores are allowed.
- Other teams may steal after an incorrect answer.
- A correct team chooses the next clue; the instructor selects it on screen.
- Responses do not need to be phrased as questions.
- The host can accept reasonable variants, use Undo score on the active clue,
  or use ± beside a score to make a manual adjustment.
- Final wagers: 0 to a team’s positive score. Teams at 0 or below may wager 0.
- Starting final without a submitted wager assigns that team 0.
- Missing final responses are incorrect; final wagers are added or subtracted.
- Final ties share the win unless the instructor asks a sudden-death question.
- Download scores from the final standings screen if desired.

CONTENT
Six progressively harder clues per category. Accounting stays introductory.
Gamecock Sports • USC History • SC History • Business Failures • Easy Accounting
Final category: 1990s Heavy Metal
Host_Answer_Key.html contains all clues, answers, accepted variants, and sources.
Business Failures includes product flops and companies that later reorganized;
the answer notes distinguish those from permanent shutdowns.

CUSTOMIZATION
Edit content.json to change live-game clues and answers. To update the standalone
HTML as well, edit its CONTENT constant, or use the included Python scripts:
python3 assemble.py (after updating content.json, with page.html and qr-inline.js)
The playable HTML requires neither Python nor Node.js in one-screen mode.

VERIFICATION
Game-rule tests and HTTP tests with five simulated teams passed, including
simultaneous buzz lockout, steals, undo, wager limits, hidden answers, and final
scoring. Frontend rendering was exercised with a simulated DOM. A full browser
visual check and an actual classroom Wi-Fi test were unavailable in this build.
To rerun the meaningful logic/API tests: node test-game.mjs and node test-api.mjs.

FILES
Carolina_Trivia.html — standalone classroom game and server frontend
server.mjs — live multiplayer server
core.js — shared game rules
content.json — editable questions, answers, and source links
Host_Answer_Key.html — instructor review copy
page.html / qr-inline.js / assemble.py — editable frontend build sources
package.json — marks local JavaScript files as ES modules
THIRD_PARTY_NOTICES.txt — QR encoder attribution

Independent classroom activity, not an official USC product or a Jeopardy! product.
