import os
import random
import subprocess
import sys
from datetime import datetime, timedelta

# ==========================================
# CONFIGURATION
# ==========================================
# How many commits do you want to generate?
NUM_COMMITS = 20

# Name of the file to modify (to create commit history)
DATA_FILENAME = "data.txt"

# Commit Author Dates will be within the last N days
DAYS_BACK = 365

# Realistic commit messages to make the history look legitimate
COMMIT_MESSAGES = [
    "Add birthday countdown timer",
    "Update party theme colors",
    "Fix responsive layout on mobile",
    "Add guest list management",
    "Improve photo gallery styling",
    "Add confetti animation on birthday",
    "Update guest invitation form",
    "Fix date picker styling",
    "Add music player to celebration page",
    "Refactor birthday calculator logic",
    "Add email notification feature",
    "Update navigation menu",
    "Fix timezone handling for dates",
    "Add gift registry section",
    "Improve accessibility for forms",
    "Update banner images",
    "Add RSVP tracking system",
    "Fix button hover states",
    "Add memories carousel",
    "Update font sizes for better readability",
    "Add cake selection feature",
    "Fix form validation errors",
    "Update celebration timeline",
    "Add guest comment section",
    "Improve loading performance",
    "Add decorative balloons animation",
    "Fix dropdown menu alignment",
    "Update color scheme",
    "Add event details page",
    "Minor UI polish"
]

def get_repo_root():
    """Finds the root of the git repository."""
    # Assumes this script is in <repo>/scripts/
    script_dir = os.path.dirname(os.path.abspath(__file__))
    return os.path.dirname(script_dir)

def random_date_in_last_year():
    """Generates a random date within the last year, weighted towards work hours."""
    today = datetime.now()
    start_date = today - timedelta(days=DAYS_BACK)
    random_days = random.randint(0, DAYS_BACK - 1)
    
    # Focus on work hours (9am - 6pm) mostly (80% chance), but some late nights
    if random.random() > 0.2:
        hour = random.randint(9, 18)
    else:
        hour = random.randint(19, 23)
        
    minute = random.randint(0, 59)
    second = random.randint(0, 59)
    
    commit_date = start_date + timedelta(days=random_days)
    commit_date = commit_date.replace(hour=hour, minute=minute, second=second)
    return commit_date

def make_commit(date, repo_path, filename):
    """Creates a modification and commits it with a specific date."""
    filepath = os.path.join(repo_path, "scripts", filename)
    
    # Ensure directory exists
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    
    # Use a random realistic message
    message = random.choice(COMMIT_MESSAGES)
    
    # Append to the data file
    with open(filepath, "a", encoding='utf-8') as f:
        f.write(f"Commit at {date.isoformat()} - {message}\n")
    
    # Stage the file
    subprocess.run(["git", "add", os.path.join("scripts", filename)], cwd=repo_path, check=True)
    
    # Set environment variables for the commit date
    env = os.environ.copy()
    date_str = date.strftime("%Y-%m-%dT%H:%M:%S")
    env["GIT_AUTHOR_DATE"] = date_str
    env["GIT_COMMITTER_DATE"] = date_str
    
    # Commit (suppress output for cleaner run)
    subprocess.run(["git", "commit", "-m", message], cwd=repo_path, env=env, stdout=subprocess.DEVNULL)

def main():
    print("="*60)
    print("🌱 Graph-Greener: Commit Generator 🌱")
    print("="*60)
    
    repo_path = get_repo_root()
    print(f"Repository Root: {repo_path}")
    print(f"Target File: scripts/{DATA_FILENAME}")
    print(f"Commits to generate: {NUM_COMMITS}")
    
    confirm = input("\nReady to generate commits? (y/n): ").lower()
    if confirm != 'y':
        print("Aborted.")
        sys.exit(0)

    print("\nGenerating commits... This may take a moment.")

    # Generate dates
    dates = [random_date_in_last_year() for _ in range(NUM_COMMITS)]
    dates.sort()

    for i, commit_date in enumerate(dates):
        if (i + 1) % 10 == 0 or i == 0:
            print(f"Progress: [{i+1}/{NUM_COMMITS}] ...", end='\r')
        make_commit(commit_date, repo_path, DATA_FILENAME)

    print(f"\n\n✅ Generated {NUM_COMMITS} commits.")
    print("To publish these changes, run: git push")

if __name__ == "__main__":
    main()
