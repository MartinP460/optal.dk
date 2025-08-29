DATA_PATH=".."
START_YEAR=2011
END_YEAR=2025

for i in {$START_YEAR..$END_YEAR}; do
    python3 combine.py $DATA_PATH/$i.csv $DATA_PATH/core/$i.csv $DATA_PATH/gender/accepted/$i.csv $DATA_PATH/gender/applied/$i.csv $DATA_PATH/age/accepted/$i.csv $DATA_PATH/age/applied/$i.csv $DATA_PATH/education/accepted/$i.csv $DATA_PATH/education/applied/$i.csv
done