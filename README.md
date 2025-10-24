# 🧾 Coupa Scorigami

A fun way to track your team's expense report scores from the Coupa system! Inspired by [NFL Scorigami](https://nflscorigami.com/) by Jon Bois.

## What is Coupa Scorigami?

Just like NFL Scorigami tracks unique game scores, Coupa Scorigami tracks which expense report scores (1-100) your team has achieved. Green squares show achieved scores, white squares are waiting to be conquered!

## Features

- **10×10 Grid**: Visual representation of scores 1-100
- **Achievement Tracking**: See who got which score and when
- **User Profiles**: Hover over achieved scores to see user details and photos
- **Statistics**: Track team completion progress
- **Responsive Design**: Works on desktop and mobile
- **GitHub Pages Ready**: Easy to host and share

## File Structure

```
coupascorigami/
├── index.html          # Main website
├── styles.css          # Styling
├── script.js           # JavaScript functionality
├── data/
│   └── achievements.json # Score achievement data
├── images/
│   ├── README.md       # Image instructions
│   └── *.jpg           # User photos
└── README.md           # This file
```

## How to Update Achievements

### 1. Add User Photos

Place user photos in the `images/` folder:
- Recommended size: 200×200px or larger
- Formats: JPG, PNG, or GIF
- Naming: Use clear names like `firstname_lastname.jpg`

### 2. Update Achievement Data

Edit `data/achievements.json` to add new achievements:

```json
{
  "achievements": [
    {
      "score": 87,
      "date": "2024-10-24",
      "username": "John Doe",
      "image": "images/john_doe.jpg"
    }
  ]
}
```

**Field Descriptions:**
- `score`: The expense report score (1-100)
- `date`: When the score was achieved (YYYY-MM-DD format)
- `username`: Person's name
- `image`: Path to their photo (relative to the site root)

### 3. Commit and Push

```bash
git add .
git commit -m "Add new achievement: Score 87 by John Doe"
git push
```

The site will update automatically if hosted on GitHub Pages!

## Hosting on GitHub Pages

1. **Create Repository**: Create a new GitHub repository
2. **Upload Files**: Push all files to the main branch
3. **Enable Pages**: 
   - Go to Settings → Pages
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)"
4. **Access Site**: Your site will be available at `https://username.github.io/repository-name`

## Development

### Local Testing

Open `index.html` in a web browser, or use a local server:

```bash
# Python 3
python -m http.server 8000

# Node.js (if you have http-server installed)
npx http-server

# Then visit http://localhost:8000
```

### Keyboard Shortcuts

- **R**: Refresh achievement data (useful during development)

### Console Commands

- `window.coupaScorigami.refresh()`: Manually refresh data
- Check browser console for helpful developer messages

## Grid Layout

The 10×10 grid represents scores 1-100 in row-wise order:

```
 1   2   3   4   5   6   7   8   9  10
11  12  13  14  15  16  17  18  19  20
21  22  23  24  25  26  27  28  29  30
31  32  33  34  35  36  37  38  39  40
41  42  43  44  45  46  47  48  49  50
51  52  53  54  55  56  57  58  59  60
61  62  63  64  65  66  67  68  69  70
71  72  73  74  75  76  77  78  79  80
81  82  83  84  85  86  87  88  89  90
91  92  93  94  95  96  97  98  99 100
```

## Customization

### Colors

Edit `styles.css` to change the color scheme:
- **Achieved scores**: `.grid-cell.achieved` (currently green)
- **Unachieved scores**: `.grid-cell` (currently white)
- **Background**: `body` gradient

### Statistics

The stats section shows:
- **Scores Achieved**: Total number of unique scores
- **Scores Remaining**: How many scores left to achieve
- **Completion**: Percentage of grid completed

## Troubleshooting

### Images Not Loading

- Check file paths in `achievements.json`
- Ensure images are in the `images/` folder
- Verify image file extensions match the JSON
- Check browser console for error messages

### Data Not Loading

- Verify `achievements.json` is valid JSON (use a JSON validator)
- Check file permissions
- Ensure the `data/` folder is in the correct location

### Mobile Issues

The site is responsive, but for very small screens:
- Grid cells become smaller but remain readable
- Tooltip layout adjusts for touch devices
- Statistics stack vertically

## Contributing

To add features or fix bugs:

1. Fork the repository
2. Make your changes
3. Test locally
4. Submit a pull request

## Credits

- **Inspiration**: [NFL Scorigami](https://nflscorigami.com/) by Jon Bois
- **Concept**: Expense report score tracking for teams using Coupa
- **Design**: Modern, responsive web design with hover interactions

---

*Happy score hunting! 🎯*
