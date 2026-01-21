// Coupa Scorigami JavaScript
// Embedded achievements data (works without server)
const ACHIEVEMENTS_DATA = {
    "achievements": [
        {
            "score": 20,
            "date": "2025-12-16",
            "username": "Marcelo Sousa",
            "image": "images/sousa.jpeg"
        },
        {
            "score": 34,
            "date": "2025-11-19",
            "username": "Jill Wilkins",
            "image": "images/wilkins.jpeg"
        },
        {
            "score": 35,
            "date": "2025-11-19",
            "username": "Annie Tedesco",
            "image": "images/tedesco.jpeg"
        },
        {
            "score": 43,
            "date": "2025-10-21",
            "username": "James Bowes",
            "image": "images/bowes.jpeg"
        },
        {
            "score": 44,
            "date": "2025-04-22",
            "username": "James Bowes",
            "image": "images/bowes.jpeg"
        },
        {
            "score": 46,
            "date": "2025-11-20",
            "username": "Annie Tedesco",
            "image": "images/tedesco.jpeg"
        },
        {
            "score": 47,
            "date": "2025-10-15",
            "username": "James Bowes",
            "image": "images/bowes.jpeg"
        },
        {
            "score": 48,
            "date": "2025-08-19",
            "username": "Ezra Tanzer",
            "image": "images/tanzer.jpeg"
        },
        {
            "score": 54,
            "date": "2025-12-19",
            "username": "James Bowes",
            "image": "images/bowes.jpeg"
        },
        {
            "score": 58,
            "date": "2025-10-10",
            "username": "Steve Winton",
            "image": "images/swinton.jpeg"
        },
        {
            "score": 59,
            "date": "2025-08-14",
            "username": "Andrew Oates",
            "image": "images/oates.jpeg"
        },
        {
            "score": 61,
            "date": "2026-01-20",
            "username": "James Bowes",
            "image": "images/bowes.jpeg"
        },
        {
            "score": 64,
            "date": "2025-10-24",
            "username": "Ezra Tanzer",
            "image": "images/tanzer.jpeg"
        },
        {
            "score": 65,
            "date": "2025-11-04",
            "username": "Ezra Tanzer",
            "image": "images/tanzer.jpeg"
        },
        {
            "score": 69,
            "date": "2025-10-31",
            "username": "David Alessi",
            "image": "images/alessi.png"
        },
        {
            "score": 72,
            "date": "2025-11-12",
            "username": "James Bowes",
            "image": "images/bowes.jpeg"
        },
        {
            "score": 73,
            "date": "2025-09-09",
            "username": "Ezra Tanzer",
            "image": "images/tanzer.jpeg"
        },
        {
            "score": 77,
            "date": "2025-11-18",
            "username": "Ezra Tanzer",
            "image": "images/tanzer.jpeg"
        },
        {
            "score": 78,
            "date": "2025-06-06",
            "username": "Ezra Tanzer",
            "image": "images/tanzer.jpeg"
        },
        {
            "score": 79,
            "date": "2025-04-30",
            "username": "Andrew MacKenzie",
            "image": "images/mackenzie.jpeg"
        },
        {
            "score": 80,
            "date": "2025-09-12",
            "username": "Ezra Tanzer",
            "image": "images/tanzer.jpeg"
        },
        {
            "score": 81,
            "date": "2025-03-05",
            "username": "Ezra Tanzer",
            "image": "images/tanzer.jpeg"
        },
        {
            "score": 82,
            "date": "2025-01-31",
            "username": "Andrew MacKenzie",
            "image": "images/mackenzie.jpeg"
        },
        {
            "score": 85,
            "date": "2025-10-16",
            "username": "Ezra Tanzer",
            "image": "images/tanzer.jpeg"
        },
        {
            "score": 88,
            "date": "2025-08-08",
            "username": "Ezra Tanzer",
            "image": "images/tanzer.jpeg"
        },
        {
            "score": 95,
            "date": "2025-11-20",
            "username": "Ryan Williams",
            "image": "images/ryan_williams.jpeg"
        },
        {
            "score": 97,
            "date": "2026-01-09",
            "username": "Ezra Tanzer",
            "image": "images/tanzer.jpeg"
        },
        {
            "score": 98,
            "date": "2025-06-11",
            "username": "James Bowes",
            "image": "images/bowes.jpeg"
        },
        {
            "score": 99,
            "date": "2025-02-07",
            "username": "Ezra Tanzer",
            "image": "images/tanzer.jpeg"
        }
    ]
};

class CoupaScorigami {
    constructor() {
        this.achievements = [];
        this.grid = document.getElementById('score-grid');
        this.tooltip = document.getElementById('tooltip');
        this.init();
    }

    init() {
        this.loadAchievements();
        this.createGrid();
        this.updateStats();
    }

    loadAchievements() {
        // Use embedded data - works without server
        this.achievements = this.processDuplicateScores(ACHIEVEMENTS_DATA.achievements || []);
    }

    processDuplicateScores(achievements) {
        // Create a map to track the earliest achievement for each score
        const scoreMap = new Map();
        
        achievements.forEach(achievement => {
            const score = achievement.score;
            const existingAchievement = scoreMap.get(score);
            
            if (!existingAchievement) {
                // First time seeing this score
                scoreMap.set(score, achievement);
            } else {
                // Compare dates to keep the earliest one (using local date parsing)
                const currentDate = this.parseLocalDate(achievement.date);
                const existingDate = this.parseLocalDate(existingAchievement.date);
                
                if (currentDate < existingDate) {
                    // Current achievement is earlier, replace the existing one
                    scoreMap.set(score, achievement);
                }
            }
        });
        
        // Convert map back to array
        return Array.from(scoreMap.values());
    }

    createGrid() {
        this.grid.innerHTML = ''; // Clear existing grid
        
        // Create 100 cells (10x10 grid)
        for (let i = 1; i <= 100; i++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            
            // Wrap score number in span for better styling
            const scoreSpan = document.createElement('span');
            scoreSpan.textContent = i;
            cell.appendChild(scoreSpan);
            
            cell.dataset.score = i;

            // Check if this score has been achieved
            const achievement = this.achievements.find(ach => ach.score === i);
            
            if (achievement) {
                this.setupAchievedCell(cell, achievement);
                this.setupTooltip(cell, achievement);
            }

            this.grid.appendChild(cell);
        }
    }

    setupAchievedCell(cell, achievement) {
        cell.classList.add('achieved');
        
        // Set background image
        const imagePath = achievement.image;
        cell.style.backgroundImage = `url('${imagePath}')`;
        
        // Handle image loading to show fallback if needed
        const img = new Image();
        img.onload = () => {
            // Image loaded successfully, keep the background
            cell.style.backgroundImage = `url('${imagePath}')`;
        };
        
        img.onerror = () => {
            // Image failed to load, use fallback color
            console.warn(`Failed to load image: ${imagePath}`);
            cell.style.backgroundImage = 'none';
            cell.style.backgroundColor = '#27ae60'; // Fallback to green
            cell.style.color = 'white';
        };
        
        img.src = imagePath;
    }

    setupTooltip(cell, achievement) {
        let hoverTimeout;

        cell.addEventListener('mouseenter', (e) => {
            // Clear any existing timeout
            clearTimeout(hoverTimeout);
            
            // Small delay to prevent flickering
            hoverTimeout = setTimeout(() => {
                this.showTooltip(e, achievement);
            }, 100);
        });

        cell.addEventListener('mouseleave', () => {
            clearTimeout(hoverTimeout);
            this.hideTooltip();
        });

        cell.addEventListener('mousemove', (e) => {
            if (this.tooltip.classList.contains('visible')) {
                this.positionTooltip(e);
            }
        });
    }

    showTooltip(event, achievement) {
        const tooltipImage = document.getElementById('tooltip-image');
        const tooltipName = document.getElementById('tooltip-name');
        const tooltipDate = document.getElementById('tooltip-date');
        const tooltipScore = document.getElementById('tooltip-score');

        // Set tooltip content
        tooltipImage.src = achievement.image || 'images/default-avatar.jpg';
        tooltipImage.alt = `${achievement.username}'s photo`;
        tooltipName.textContent = achievement.username;
        tooltipDate.textContent = this.formatDate(achievement.date);
        tooltipScore.textContent = `Score: ${achievement.score}`;

        // Position and show tooltip
        this.positionTooltip(event);
        this.tooltip.classList.add('visible');

        // Handle image loading error
        tooltipImage.onerror = () => {
            tooltipImage.src = 'images/default-avatar.jpg';
        };
    }

    positionTooltip(event) {
        const tooltipRect = this.tooltip.getBoundingClientRect();
        const container = this.tooltip.parentElement; // Get the container
        const containerRect = container.getBoundingClientRect();
        
        // Convert mouse position to container-relative coordinates
        const mouseX = event.clientX - containerRect.left;
        const mouseY = event.clientY - containerRect.top;
        
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let x = mouseX + 15;
        let y = mouseY - tooltipRect.height / 2;

        // Check if tooltip would go off the right edge of the viewport
        const tooltipRightEdgeViewport = containerRect.left + x + tooltipRect.width;
        if (tooltipRightEdgeViewport > viewportWidth) {
            x = mouseX - tooltipRect.width - 15;
        }

        // Ensure tooltip doesn't go off left edge of container
        if (x < 0) {
            x = 10;
        }

        // Check if tooltip would go off top of viewport
        const tooltipTopEdgeViewport = containerRect.top + y;
        if (tooltipTopEdgeViewport < 0) {
            y = mouseY + 20; // Position below cursor instead
        }
        
        // Check if tooltip would go off bottom of viewport
        const tooltipBottomEdgeViewport = containerRect.top + y + tooltipRect.height;
        if (tooltipBottomEdgeViewport > viewportHeight) {
            y = containerRect.height - tooltipRect.height - 10;
        }

        this.tooltip.style.left = `${x}px`;
        this.tooltip.style.top = `${y}px`;
    }

    hideTooltip() {
        this.tooltip.classList.remove('visible');
    }

    updateStats() {
        const achievedCount = this.achievements.length;
        const remainingCount = 100 - achievedCount;

        document.getElementById('achieved-count').textContent = achievedCount;
        document.getElementById('remaining-count').textContent = remainingCount;

        // Add some animation to the stats
        this.animateStats();
    }

    animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
            stat.style.transform = 'scale(1.1)';
            setTimeout(() => {
                stat.style.transform = 'scale(1)';
            }, 200);
        });
    }

    parseLocalDate(dateString) {
        // Parse date as local date to avoid timezone issues
        const [year, month, day] = dateString.split('-');
        return new Date(year, month - 1, day); // month is 0-indexed
    }

    formatDate(dateString) {
        try {
            const date = this.parseLocalDate(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return dateString; // Return original if formatting fails
        }
    }

    // Method to refresh data (useful for development)
    refresh() {
        this.loadAchievements();
        this.createGrid();
        this.updateStats();
    }
}

// Video Modal Handler
class VideoModalHandler {
    constructor() {
        this.modal = document.getElementById('video-modal');
        this.video = document.getElementById('intro-video');
        this.icon = document.getElementById('video-icon');
        this.closeBtn = document.getElementById('video-close');
        this.playBtn = document.getElementById('video-play-btn');
        this.init();
    }

    init() {
        // Setup event listeners
        this.setupEventListeners();
        
        // Show modal on page load
        this.showModal();
    }

    setupEventListeners() {
        // Video ended - collapse to icon
        this.video.addEventListener('ended', () => {
            this.shrinkToIcon();
        });

        // Close button - collapse to icon
        this.closeBtn.addEventListener('click', () => {
            this.shrinkToIcon();
        });

        // Icon click - show modal again
        this.icon.addEventListener('click', () => {
            this.showModal();
        });

        // Play button click
        this.playBtn.addEventListener('click', () => {
            this.playVideo();
        });

        // Video playing - hide play button
        this.video.addEventListener('play', () => {
            this.playBtn.classList.add('hidden');
        });

        // Video paused - show play button (if not ended)
        this.video.addEventListener('pause', () => {
            if (!this.video.ended) {
                this.playBtn.classList.remove('hidden');
            }
        });
    }

    showModal() {
        // Reset video state
        this.video.currentTime = 0;
        this.video.pause();
        
        // Show modal
        this.modal.classList.remove('hidden', 'shrinking');
        this.modal.style.display = 'flex';
        
        // Hide icon
        this.icon.style.display = 'none';
        
        // Show play button
        this.playBtn.classList.remove('hidden');
    }

    playVideo() {
        this.video.play();
        this.playBtn.classList.add('hidden');
    }

    shrinkToIcon() {
        // Pause video
        this.video.pause();
        
        // Get icon position relative to viewport
        // Icon is positioned at top: 20px, right: 20px within the container
        const iconSize = 60; // 60px width/height
        const iconTop = 20;
        const iconRight = 20;
        
        // Get container position to calculate absolute icon position
        const container = document.querySelector('.container');
        const containerRect = container.getBoundingClientRect();
        
        // Calculate target position (center of icon) relative to viewport
        const targetX = containerRect.right - iconRight - iconSize / 2;
        const targetY = containerRect.top + iconTop + iconSize / 2;
        
        // Get current modal content position (center of viewport)
        const modalContent = this.modal.querySelector('.video-modal-content');
        const modalRect = modalContent.getBoundingClientRect();
        const currentX = modalRect.left + modalRect.width / 2;
        const currentY = modalRect.top + modalRect.height / 2;
        
        // Calculate translation needed
        const translateX = targetX - currentX;
        const translateY = targetY - currentY;
        
        // Calculate scale (icon size relative to modal content)
        const scale = iconSize / Math.max(modalRect.width, modalRect.height);
        
        // Apply transform
        modalContent.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
        
        // Add shrinking class for animation
        this.modal.classList.add('shrinking');
        
        // After animation completes, hide modal and show icon
        setTimeout(() => {
            this.modal.classList.add('hidden');
            this.modal.classList.remove('shrinking');
            this.modal.style.display = 'none';
            
            // Show icon in upper right corner
            this.icon.style.display = 'block';
            
            // Reset modal transform for next time
            setTimeout(() => {
                modalContent.style.transform = '';
            }, 100);
        }, 800); // Match animation duration
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.coupaScorigami = new CoupaScorigami();
    window.videoModalHandler = new VideoModalHandler();
});

// Add some fun interactions
document.addEventListener('DOMContentLoaded', () => {
    // Add sparkle effect on grid hover
    const grid = document.getElementById('score-grid');
    
    grid.addEventListener('mouseenter', () => {
        grid.style.transform = 'scale(1.02)';
    });
    
    grid.addEventListener('mouseleave', () => {
        grid.style.transform = 'scale(1)';
    });

});

// Keyboard shortcuts for convenience
document.addEventListener('keydown', (e) => {
    // Press 'R' to refresh data
    if (e.key.toLowerCase() === 'r' && !e.ctrlKey && !e.metaKey) {
        window.coupaScorigami?.refresh();
    }
});
