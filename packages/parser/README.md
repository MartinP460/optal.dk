# Parser

This package contains the functionality to parse .csv files containing the KOT data, and to generate different formats for that data.

### File structure

The `src` directory contains two main folders:

1. `core` - functions for parsing .csv files containing KOT data and converting the data to an array of objects.
2. `strategies` - functions for generating and outputting files from the parsed data. It takes inspiration from the "strategy pattern", in that each file outputs a different format (each file can be thought of as a seperate "strategy").

The `data` directory contains the raw .csv files that need to be parsed. Each file represents a different year of admission data.
The `generated` directory contains the files that were generated from each strategy.
