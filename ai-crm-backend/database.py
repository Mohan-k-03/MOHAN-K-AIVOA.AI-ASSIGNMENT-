import sqlite3

def setup_mock_db():
    # This creates a local SQL database file named 'crm_data.db'
    conn = sqlite3.connect('crm_data.db')
    cursor = conn.cursor()
    
    # 1. Create a table using standard SQL syntax (works in MySQL/Postgres too)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS past_interactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            hcp_name TEXT,
            last_meeting_date TEXT,
            sentiment TEXT
        )
    ''')
    
    # Clear old data so we don't get duplicates if you run this twice
    cursor.execute('DELETE FROM past_interactions')
    
    # 2. Insert some mock data for our LangGraph tool to find
    sample_data = [
        ('Dr. Charles Smith', '2025-10-12', 'Neutral'),
        ('Dr. John', '2025-11-04', 'Negative'),
        ('Dr. Sarah', '2026-01-15', 'Positive')
    ]
    
    cursor.executemany('''
        INSERT INTO past_interactions (hcp_name, last_meeting_date, sentiment)
        VALUES (?, ?, ?)
    ''', sample_data)
    
    conn.commit()
    conn.close()
    print("SQL Database successfully created and populated!")

if __name__ == "__main__":
    setup_mock_db()