import csv
import sys
import os

# Column indices
CSV_MAIN_ID_COLUMN_INDEX = 0  # First column in main.csv contains course ID
CSV_INPUT_ID_COLUMN_INDEX = 2  # Third column in input CSV contains course ID
CSV_INPUT_DATA_COLUMN_INDEX_START = 4  # Fifth column onwards contains data to append

def clean_course_id(course_id):
    """
    Clean course ID by removing BOM and other invisible characters.
    
    Args:
        course_id: Raw course ID string
        
    Returns:
        Cleaned course ID string
    """
    # Remove trailing spaces
    cleaned = course_id.strip()
    
    # Remove BOM character if present
    if cleaned.startswith('\ufeff'):
        cleaned = cleaned[1:]
    
    # Remove other common invisible characters
    cleaned = cleaned.replace('\u200b', '')  # Zero-width space
    cleaned = cleaned.replace('\u200c', '')  # Zero-width non-joiner
    cleaned = cleaned.replace('\u200d', '')  # Zero-width joiner
    cleaned = cleaned.replace('\u2060', '')  # Word joiner
    
    return cleaned.strip()

def normalize_columns(data_columns):
    """
    Remove trailing empty columns from data columns.
    
    Args:
        data_columns: List of data columns
        
    Returns:
        List with trailing empty columns removed
    """
    # Find the last non-empty column
    last_non_empty_index = -1
    for i, col in enumerate(data_columns):
        if col and col.strip():
            last_non_empty_index = i
    
    # Return columns up to the last non-empty one (inclusive)
    if last_non_empty_index >= 0:
        return data_columns[:last_non_empty_index + 1]
    else:
        return []

def combine_csv_files(main_csv_path, input_csv_paths, output_csv_path):
    """
    Combine CSV files by matching course IDs and appending data columns from multiple input files.
    Preserves the exact order and structure of main.csv.
    
    Args:
        main_csv_path: Path to the main CSV file
        input_csv_paths: List of paths to input CSV files to append data from
        output_csv_path: Path to write the combined result
    """
        
    # Read all input CSVs and create mappings of course ID to data columns
    all_input_data = {}  # Will store: {course_id: [data_from_file1, data_from_file2, ...]}
    file_column_counts = []  # Store the normalized column count for each file
    
    for file_index, input_csv_path in enumerate(input_csv_paths):        
        input_data = {}
        max_columns = 0
        
        # First pass: read all data and find the maximum number of non-empty columns
        with open(input_csv_path, 'r', newline='', encoding='utf-8') as csvfile:
            reader = csv.reader(csvfile, delimiter=';')
            for row_num, row in enumerate(reader):
                # Process all rows (no header to skip)
                if len(row) > CSV_INPUT_ID_COLUMN_INDEX and row[CSV_INPUT_ID_COLUMN_INDEX].strip():
                    course_id = clean_course_id(row[CSV_INPUT_ID_COLUMN_INDEX])
                    if course_id:  # Only add if course_id is not empty after cleaning
                        # Extract data columns
                        data_columns = row[CSV_INPUT_DATA_COLUMN_INDEX_START:] if len(row) > CSV_INPUT_DATA_COLUMN_INDEX_START else []
                        # Normalize columns (remove trailing empty ones)
                        normalized_columns = normalize_columns(data_columns)
                        max_columns = max(max_columns, len(normalized_columns))
                        input_data[course_id] = normalized_columns
        
        # Second pass: ensure all rows have the same number of columns
        for course_id in input_data:
            current_columns = len(input_data[course_id])
            if current_columns < max_columns:
                # Pad with empty columns to match the maximum
                input_data[course_id].extend([''] * (max_columns - current_columns))
        
        file_column_counts.append(max_columns)
        
        # Merge this file's data into the combined data structure
        for course_id, data_columns in input_data.items():
            if course_id not in all_input_data:
                all_input_data[course_id] = [None] * len(input_csv_paths)  # Initialize with None for all files
            all_input_data[course_id][file_index] = data_columns
        
    # Read main CSV and process each row in order
    combined_rows = []
    matched_count = 0
    total_rows = 0
    missing_course_ids = []
    
    with open(main_csv_path, 'r', newline='', encoding='utf-8') as csvfile:
        reader = csv.reader(csvfile, delimiter=';')
        for row_num, row in enumerate(reader):
            total_rows += 1
            
            # Check if this row has a valid course ID (non-empty first column)
            if len(row) > CSV_MAIN_ID_COLUMN_INDEX and row[CSV_MAIN_ID_COLUMN_INDEX].strip():
                # This is a course row - try to append data from all input files
                course_id = clean_course_id(row[CSV_MAIN_ID_COLUMN_INDEX])
                
                if course_id and course_id in all_input_data:
                    # Found matching data - append data from all input files in order
                    data_from_all_files = []
                    for file_index, file_data in enumerate(all_input_data[course_id]):
                        if file_data is not None:
                            data_from_all_files.extend(file_data)
                        else:
                            # No data from this file, add empty columns to maintain alignment
                            expected_columns = file_column_counts[file_index]
                            data_from_all_files.extend([''] * expected_columns)
                    
                    combined_row = row + data_from_all_files
                    matched_count += 1
                else:
                    # No matching data found - add empty columns to maintain alignment
                    if course_id:  # Only report if it's a real course ID (not empty after cleaning)
                        missing_course_ids.append(course_id)
                    
                    # Calculate total expected columns from all input files
                    total_expected_columns = sum(file_column_counts)
                    
                    # Add empty columns to maintain alignment
                    empty_columns = [''] * total_expected_columns
                    combined_row = row + empty_columns
            else:
                # This is a non-course row (institution header, summary, separator, etc.)
                # Add empty columns to maintain alignment with course rows
                total_expected_columns = sum(file_column_counts)
                
                # Add empty columns to maintain alignment
                empty_columns = [''] * total_expected_columns
                combined_row = row + empty_columns
            
            combined_rows.append(combined_row)
    
    # Report missing course IDs
    if missing_course_ids:
        print(f"\nWARNING: {len(missing_course_ids)} course IDs from main file were not found in one or more input files:")
        for course_id in missing_course_ids:
            print(f" - {course_id} ")
        print('\n')
        
    # Write combined data to output file
    with open(output_csv_path, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile, delimiter=';')
        for row in combined_rows:
            writer.writerow(row)
    
def main():
    """Main function to handle command line arguments and execute the combination."""
    
    if len(sys.argv) < 4:
        print("Usage: python3 combine.py <output_file> <main_file> <input_file1> [input_file2] [input_file3] ...")
        sys.exit(1)
    
    output_csv_path = sys.argv[1]
    main_csv_path = sys.argv[2]
    input_csv_paths = sys.argv[3:]
    
    # Check if main.csv exists
    if not os.path.exists(main_csv_path):
        print(f"Error: Main file '{main_csv_path}' not found")
        sys.exit(1)
    
    # Check if all input files exist
    for input_csv_path in input_csv_paths:
        if not os.path.exists(input_csv_path):
            print(f"Error: Input file '{input_csv_path}' not found")
            sys.exit(1)
    
    try:
        combine_csv_files(main_csv_path, input_csv_paths, output_csv_path)
        print("CSV combination completed successfully!")
    except Exception as e:
        print(f"Error during CSV combination: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()