# My Portfolio

A modern, responsive portfolio website showcasing my web development projects and skills.

## Features

- **Modern Design**: Clean, minimalist interface with smooth animations
- **Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- **Project Showcase**: Detailed pages for each featured project
- **Easy Deployment**: Ready to deploy on Render or similar platforms

## Projects Featured

1. **SamePath** - Student collaboration platform built with React Native
2. **RealEstateHirsch** - Professional real estate website
3. **SportsPredictor** - ML-powered sports analytics system ([download](./public/downloads/sportsPredictor.zip) to try it locally)

## Technologies Used

- HTML5
- CSS3 (with animations and responsive design)
- JavaScript
- Express.js
- Node.js

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Or start the production server:
```bash
npm start
```

## Deployment

This project is configured to deploy easily on Render:

1. Connect your GitHub repository to Render
2. Set up a new Web Service
3. Render will automatically detect the Node.js environment
4. The site will be live at `https://your-app-name.onrender.com`

## Local Development

The server runs on `http://localhost:3000` by default.

## Project Structure

```
myPortfolio/
├── server.js           # Express server configuration
├── package.json        # Dependencies and scripts
├── README.md          # This file
└── public/            # Static files
    ├── index.html     # Home page
    ├── about.html     # About page
    ├── projects.html  # Projects showcase page
    └── styles.css     # Global styles
```

## Try SportsPredictor Locally

1. [Download the zipped project](./public/downloads/sportsPredictor.zip) from this repository.
2. Extract the archive and open a terminal in the `sportsPredictor` folder.
3. Follow the instructions in `readme.md` to launch the API with Uvicorn or open `web/index.html` to explore the UI.

## Future Enhancements

- Add blog functionality
- Integrate contact form with backend
- Add project filtering and search
- Implement dark mode
- Add more interactive animations

