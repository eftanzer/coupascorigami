// Coupa Scorigami JavaScript
class CoupaScorigami {
    constructor() {
        this.achievements = [];
        this.grid = document.getElementById('score-grid');
        this.tooltip = document.getElementById('tooltip');
        this.init();
    }

    async init() {
        try {
            await this.loadAchievements();
            this.createGrid();
            this.updateStats();
        } catch (error) {
            console.error('Error initializing Coupa Scorigami:', error);
            this.createGrid(); // Create grid even if data loading fails
            this.updateStats();
        }
    }

    async loadAchievements() {
        try {
            const response = await fetch('data/achievements.json');
            if (!response.ok) {
                throw new Error('Could not load achievements data');
            }
            const data = await response.json();
            this.achievements = this.processDuplicateScores(data.achievements || []);
        } catch (error) {
            console.warn('No achievements data found, starting with empty grid');
            this.achievements = [];
        }
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
                    console.log(`Duplicate score ${score}: Keeping earlier date ${achievement.date} (${achievement.username}) over ${existingAchievement.date} (${existingAchievement.username})`);
                } else {
                    console.log(`Duplicate score ${score}: Keeping earlier date ${existingAchievement.date} (${existingAchievement.username}) over ${achievement.date} (${achievement.username})`);
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
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let x = event.pageX + 15;
        let y = event.pageY - tooltipRect.height / 2;

        // Adjust if tooltip would go off screen
        if (x + tooltipRect.width > viewportWidth) {
            x = event.pageX - tooltipRect.width - 15;
        }

        if (y < 0) {
            y = 10;
        } else if (y + tooltipRect.height > viewportHeight) {
            y = viewportHeight - tooltipRect.height - 10;
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
        const completionPercentage = Math.round((achievedCount / 100) * 100);

        document.getElementById('achieved-count').textContent = achievedCount;
        document.getElementById('remaining-count').textContent = remainingCount;
        document.getElementById('completion-percentage').textContent = `${completionPercentage}%`;

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
    async refresh() {
        await this.loadAchievements();
        this.createGrid();
        this.updateStats();
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.coupaScorigami = new CoupaScorigami();
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

    // Console message for developers
    console.log('🧾 Coupa Scorigami loaded! Use window.coupaScorigami.refresh() to reload data.');
});

// Keyboard shortcuts for convenience
document.addEventListener('keydown', (e) => {
    // Press 'R' to refresh data
    if (e.key.toLowerCase() === 'r' && !e.ctrlKey && !e.metaKey) {
        window.coupaScorigami?.refresh();
        console.log('Data refreshed!');
    }
});
