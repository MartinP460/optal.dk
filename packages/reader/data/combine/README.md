This is a small helper tool to combine .csv files into a single .csv file by appending columns onto one another.

Run the command below to combine data from all .csv files from the legacy structure. Adjust the variables accordingly before running.

```bash
DATA_PATH="../packages/reader/data"
START_YEAR=2011
END_YEAR=2025
zsh ./combine.sh
```

Run the command below to combine data into one .csv file for a single year. Input files should be named `core.csv`, `genderAccepted.csv`, `genderApplied.csv`, `ageAccepted.csv`, `ageApplied.csv`, `educationAccepted.csv`, and `educationApplied.csv`. Place them in the same directory as `combine.py`.

```bash
YEAR=2026
python3 combine.py $YEAR.csv core.csv genderAccepted.csv genderApplied.csv ageAccepted.csv ageApplied.csv educationAccepted.csv educationApplied.csv
```
