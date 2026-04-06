#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

// Parse command line arguments
const [score, date, fullName, isFirstScore, imagesJson, issueNumber] = process.argv.slice(2);
const images = JSON.parse(imagesJson);
const isFirst = isFirstScore === 'true';

console.log('Processing submission:', { score, date, fullName, isFirst, imageCount: images.length });

// Generate image filename from name
function generateImageFilename(name) {
  const parts = name.toLowerCase().split(' ');
  const firstName = parts[0];
  const lastName = parts[parts.length - 1];
  return `${firstName}_${lastName}`;
}

// Download image from URL
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${filepath}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

// Determine file extension from URL
function getExtension(url) {
  const match = url.match(/\.(jpeg|jpg|png)(\?|$)/i);
  if (match) {
    return match[1].toLowerCase() === 'jpg' ? 'jpeg' : match[1].toLowerCase();
  }
  return 'jpeg'; // default
}

async function processSubmission() {
  try {
    // Create evidence directory if it doesn't exist
    const evidenceDir = path.join(process.cwd(), 'evidence');
    if (!fs.existsSync(evidenceDir)) {
      fs.mkdirSync(evidenceDir, { recursive: true });
      console.log('Created evidence directory');
    }

    // Determine which image is which
    let profileImageUrl = null;
    let evidenceImageUrl = null;

    if (isFirst && images.length >= 2) {
      // First submission: first image is profile, second is evidence
      profileImageUrl = images[0];
      evidenceImageUrl = images[1];
    } else {
      // Not first submission or only one image: it's evidence
      evidenceImageUrl = images[0];
    }

    // Generate filenames
    const imageBasename = generateImageFilename(fullName);
    let profileImagePath = null;
    
    // Download profile image if first submission
    if (isFirst && profileImageUrl) {
      const ext = getExtension(profileImageUrl);
      const profileFilename = `${imageBasename}.${ext}`;
      profileImagePath = path.join(process.cwd(), 'images', profileFilename);
      await downloadImage(profileImageUrl, profileImagePath);
    }

    // Download evidence screenshot
    const evidenceExt = getExtension(evidenceImageUrl);
    const evidenceFilename = `score_${score}_${imageBasename}.${evidenceExt}`;
    const evidencePath = path.join(evidenceDir, evidenceFilename);
    await downloadImage(evidenceImageUrl, evidencePath);

    // Determine image path for ACHIEVEMENTS_DATA
    let imagePath;
    if (isFirst && profileImagePath) {
      // New user - use the profile image we just downloaded
      const ext = getExtension(profileImageUrl);
      imagePath = `images/${imageBasename}.${ext}`;
    } else {
      // Existing user - find their existing image
      const imagesDir = path.join(process.cwd(), 'images');
      const existingImages = fs.readdirSync(imagesDir)
        .filter(f => f.startsWith(imageBasename) && (f.endsWith('.jpeg') || f.endsWith('.png') || f.endsWith('.jpg')));
      
      if (existingImages.length > 0) {
        imagePath = `images/${existingImages[0]}`;
      } else {
        throw new Error(`No existing image found for ${fullName}. If this is your first submission, please check the "First Score Submission" box.`);
      }
    }

    // Read script.js
    const scriptPath = path.join(process.cwd(), 'script.js');
    let scriptContent = fs.readFileSync(scriptPath, 'utf8');

    // Find the ACHIEVEMENTS_DATA section
    const achievementsMatch = scriptContent.match(/(const ACHIEVEMENTS_DATA = \{[\s\S]*?"achievements": \[)([\s\S]*?)(\s*\]\s*\};)/);
    
    if (!achievementsMatch) {
      throw new Error('Could not find ACHIEVEMENTS_DATA in script.js');
    }

    const [, prefix, achievementsContent, suffix] = achievementsMatch;

    // Create new achievement entry
    const newAchievement = {
      score: parseInt(score),
      date: date,
      username: fullName,
      image: imagePath
    };

    // Parse existing achievements to find insertion point
    // We'll add to the end for simplicity, but could sort by score if needed
    const indent = '        ';
    const newEntry = `${indent}{\n` +
                     `${indent}    "score": ${newAchievement.score},\n` +
                     `${indent}    "date": "${newAchievement.date}",\n` +
                     `${indent}    "username": "${newAchievement.username}",\n` +
                     `${indent}    "image": "${newAchievement.image}"\n` +
                     `${indent}}`;

    // Add comma to last entry if needed
    const trimmedContent = achievementsContent.trim();
    const hasTrailingComma = trimmedContent.endsWith(',');
    
    let updatedAchievements = achievementsContent;
    if (!hasTrailingComma && trimmedContent.length > 0) {
      // Add comma to the last entry
      const lastBraceIndex = updatedAchievements.lastIndexOf('}');
      updatedAchievements = updatedAchievements.substring(0, lastBraceIndex + 1) + ',' + updatedAchievements.substring(lastBraceIndex + 1);
    }

    // Add new entry
    updatedAchievements = updatedAchievements + '\n' + newEntry;

    // Reconstruct the file
    scriptContent = prefix + updatedAchievements + suffix;

    // Write back to script.js
    fs.writeFileSync(scriptPath, scriptContent, 'utf8');
    console.log('Updated script.js with new achievement');

    console.log('Submission processed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('Error processing submission:', error.message);
    process.exit(1);
  }
}

processSubmission();
