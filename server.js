const express = require('express');
const path = require('path');
const { spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/projects', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'projects.html'));
});

// API: Run single matchup prediction (NFL)
app.post('/api/sports/predict', (req, res) => {
    try {
        const { league, homeTeam, awayTeam, neutral } = req.body || {};
        if (!league || !homeTeam || !awayTeam) {
            return res.status(400).send('Missing required fields: league, homeTeam, awayTeam');
        }
        if (league !== 'NFL') {
            return res.status(400).send('Only NFL is supported right now');
        }

        const nflDir = path.resolve(__dirname, '..', 'sportsPredictor', 'NFL');
        const py = process.platform === 'win32' ? 'python' : 'python3';

        const code = `import sys\nfrom predictor import read_nfl_data, advanced_prediction\nfrom injuryextract import get_injury_data\n\nhome_team = sys.argv[1]\naway_team = sys.argv[2]\nneutral = bool(int(sys.argv[3]))\n\nprint('Loading NFL data...')\nteams_data = read_nfl_data()\nif not teams_data:\n    print('Failed to load data. Exiting.')\n    sys.exit(1)\n\nprint('Fetching injury data...')\ntry:\n    injury_data = get_injury_data()\nexcept Exception as e:\n    injury_data = None\n    print(f'Error loading injury data: {e}')\n\nprint('='*100)\nprint(f'GAME PREDICTION: {away_team} @ {home_team}')\nprint('='*100)\n\nresult = advanced_prediction(home_team, away_team, teams_data, neutral, injury_data)\nif result:\n    hp, ap = result['home_points'], result['away_points']\n    print('\n' + '='*100)\n    print('FINAL PREDICTION')\n    print('='*100)\n    print(f"{home_team}: {hp:.1f} points")\n    print(f"{away_team}: {ap:.1f} points")\n    if hp > ap:\n        diff = hp - ap\n        conf = min(diff / 6 * 100, 95)\n        print(f'PREDICTION: {home_team} wins')\n        print(f'Confidence: {conf:.1f}%')\n    elif ap > hp:\n        diff = ap - hp\n        conf = min(diff / 6 * 100, 95)\n        print(f'PREDICTION: {away_team} wins')\n        print(f'Confidence: {conf:.1f}%')\n    else:\n        print('PREDICTION: Too close to call')\n        print('Confidence: 50.0% (toss-up)')\n    print('\n' + '='*100)\nelse:\n    print('ERROR: Could not generate prediction')\n`;

        const args = ['-c', code, homeTeam, awayTeam, (neutral ? '1' : '0')];
        const proc = spawn(py, args, { cwd: nflDir });
        let out = '';
        let err = '';
        proc.stdout.on('data', (d) => (out += d.toString()));
        proc.stderr.on('data', (d) => (err += d.toString()));
        proc.on('close', (code) => {
            if (code !== 0) {
                return res.status(500).send((out + '\n' + err).trim() || 'Prediction failed');
            }
            res.type('text/plain').send((out || '').trim());
        });
    } catch (e) {
        res.status(500).send('Server error');
    }
});

// API: Run NFL weekly batch summary (non-interactive)
app.get('/api/sports/nfl/batch', (req, res) => {
    const week = parseInt(String(req.query.week || '')); 
    const season = String(req.query.season || 'regular');
    if (!Number.isFinite(week) || week < 1 || week > 18) {
        return res.status(400).send('Invalid week (1-18)');
    }
    const nflDir = path.resolve(__dirname, '..', 'sportsPredictor', 'NFL');
    const py = process.platform === 'win32' ? 'python' : 'python3';
    const code = `from batch_predict import batch_predict_week\nbatch_predict_week(${week}, '${season}', True)`;
    const proc = spawn(py, ['-c', code], { cwd: nflDir });
    let out = '';
    let err = '';
    proc.stdout.on('data', (d) => (out += d.toString()));
    proc.stderr.on('data', (d) => (err += d.toString()));
    proc.on('close', (code) => {
        if (code !== 0) {
            return res.status(500).send((out + '\n' + err).trim() || 'Batch run failed');
        }
        res.type('text/plain').send((out || '').trim());
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

