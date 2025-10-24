# Images Folder

Place user photos in this folder and reference them in the `achievements.json` file.

## Image Requirements

- **Format**: JPG, PNG, or GIF
- **Size**: Recommended 200x200px or larger (will be displayed as 60x60px circles)
- **Naming**: Use descriptive names like `firstname_lastname.jpg`

## Example Structure

```
images/
├── alice.jpg
├── bob.jpg
├── carol.jpg
├── david.jpg
├── eve.jpg
└── default-avatar.jpg (fallback image)
```

## Adding Images

1. Add the image file to this folder
2. Update `data/achievements.json` with the correct path
3. The path should be relative: `"image": "images/username.jpg"`

## Default Avatar

If an image fails to load, the system will attempt to use `images/default-avatar.jpg` as a fallback. You may want to add a default avatar image for better user experience.
