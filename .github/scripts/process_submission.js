#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Parse command line arguments
const [score, date, fullName] = process.argv.slice(2);

// Validate inputs
if (!score || !/^\d+$/.test(score)) {
  console.error('Invalid score format');
  process.exit(1);
}

if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
  console.error('Invalid date format');
  process.exit(1);
}

if (!fullName || fullName.trim().length === 0) {
  console.error('Invalid full name');
  process.exit(1);
}

console.log('Processing submission:', { score, date, fullName });

// Sanitize filename to prevent path traversal
function sanitizeFilename(filename) {
  // Remove path separators and traversal sequences
  return filename.replace(/[/\\.\0]/g, '_').replace(/_+/g, '_');
}

// Generate image filename from name
function generateImageFilename(name) {
  const parts = name.toLowerCase().split(' ');
  const firstName = sanitizeFilename(parts[0]);
  const lastName = sanitizeFilename(parts[parts.length - 1]);
  return `${firstName}_${lastName}`;
}

function processSubmission() {
  try {
    const imageBasename = generateImageFilename(fullName);

    // Check if user already has an image in the images directory
    const imagesDir = path.join(process.cwd(), 'images');
    const existingImages = fs.readdirSync(imagesDir)
      .filter(f => {
        const isSafe = /^[a-z0-9_]+\.(jpeg|jpg|png)$/i.test(f);
        return isSafe && f.startsWith(imageBasename) && (f.endsWith('.jpeg') || f.endsWith('.png') || f.endsWith('.jpg'));
      });
    
    const hasExistingImage = existingImages.length > 0;
    const imagePath = hasExistingImage
      ? `images/${existingImages[0]}`
      : `images/${imageBasename}.jpeg`;

    // Write result for the workflow to read
    const outputFile = process.env.GITHUB_OUTPUT;
    if (outputFile) {
      fs.appendFileSync(outputFile, `needsPhoto=${!hasExistingImage}\n`);
    }
    console.log(`User image found: ${hasExistingImage}`);

    // Read script.js
    const scriptPath = path.join(process.cwd(), 'script.js');
    let scriptContent = fs.readFileSync(scriptPath, 'utf8');

    // Escape special characters for JSON
    function escapeJson(str) {
      return str.replace(/\\/g, '\\\\')
                .replace(/"/g, '\\"')
                .replace(/\n/g, '\\n')
                .replace(/\r/g, '\\r')
                .replace(/\t/g, '\\t');
    }

    const newScore = parseInt(score);
    const indent = '        ';

    // Find the achievements array boundaries
    const arrayStartMarker = '"achievements": [';
    const arrayEndMarker = '    ]\n};';
    const arrayStartIndex = scriptContent.indexOf(arrayStartMarker);
    const arrayEndIndex = scriptContent.indexOf(arrayEndMarker);

    if (arrayStartIndex === -1 || arrayEndIndex === -1) {
      throw new Error('Could not find achievements array in script.js');
    }

    const contentStart = arrayStartIndex + arrayStartMarker.length;
    const arrayContent = scriptContent.substring(contentStart, arrayEndIndex);

    // Find the right position by locating each "score": N pattern
    const scoreRegex = /"score":\s*(\d+)/g;
    let insertAfterIndex = -1;
    let insertBeforeIndex = -1;
    let scoreMatch;
    let lastEntryEnd = -1;

    while ((scoreMatch = scoreRegex.exec(arrayContent)) !== null) {
      const existingScore = parseInt(scoreMatch[1]);

      // Find the closing "}" of this entry
      const closingBrace = arrayContent.indexOf('}', scoreMatch.index + scoreMatch[0].length);

      if (existingScore < newScore) {
        insertAfterIndex = contentStart + closingBrace;
        lastEntryEnd = contentStart + closingBrace;
      } else if (existingScore > newScore && insertBeforeIndex === -1) {
        insertBeforeIndex = scoreMatch.index;
        break;
      }
    }

    // Build the new entry
    const newEntryBlock = `\n${indent}{\n` +
                          `${indent}    "score": ${newScore},\n` +
                          `${indent}    "date": "${escapeJson(date)}",\n` +
                          `${indent}    "username": "${escapeJson(fullName)}",\n` +
                          `${indent}    "image": "${escapeJson(imagePath)}"\n` +
                          `${indent}}`;

    if (insertAfterIndex === -1) {
      // New score is the smallest - insert at the beginning of the array
      const firstEntryStart = arrayContent.search(/\S/);
      if (firstEntryStart === -1) {
        throw new Error('Empty achievements array');
      }
      const absoluteInsertPos = contentStart + firstEntryStart;
      scriptContent = scriptContent.substring(0, absoluteInsertPos) +
                      `{\n` +
                      `${indent}    "score": ${newScore},\n` +
                      `${indent}    "date": "${escapeJson(date)}",\n` +
                      `${indent}    "username": "${escapeJson(fullName)}",\n` +
                      `${indent}    "image": "${escapeJson(imagePath)}"\n` +
                      `${indent}},\n${indent}` +
                      scriptContent.substring(absoluteInsertPos);
    } else {
      // Insert after the found position, with comma
      scriptContent = scriptContent.substring(0, insertAfterIndex + 1) +
                      ',' + newEntryBlock +
                      scriptContent.substring(insertAfterIndex + 1);
    }

    // Write back to script.js
    fs.writeFileSync(scriptPath, scriptContent, 'utf8');
    console.log(`Updated script.js: inserted score ${newScore} in sorted position`);

    console.log('Submission processed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('Error processing submission:', error.message);
    process.exit(1);
  }
}

processSubmission();
