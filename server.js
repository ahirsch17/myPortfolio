const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Demo page with relaxed CSP to allow Babel/unsafe-eval (must be before static middleware)
app.get('/playground/effort-score-demo.html', (req, res, next) => {
    res.set('Content-Security-Policy',
        "default-src 'self'; " +
        "style-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com https://cdn.tailwindcss.com; " +
        "connect-src 'self'; img-src 'self' data:; font-src 'self';"
    );
    next();
});

// Serve static files
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

