Context: RStudio is used to write and run the R script.

Install following packages: here, tidyverse

copy and paste the two lines below in the console:
install.packages("here")
install.packages("tidyverse")

------------------------------
Note:
Additional cleaning was done after running the R script.
Excel was used to remove all values that had the text "NA".
(These are not the empty values in the file.)

========================================================
Data Source:

GDP Growth
https://data.worldbank.org/indicator/NY.GDP.MKTP.KD.ZG?end=2024&start=1991

Unemployment Rate
https://data.worldbank.org/indicator/SL.UEM.TOTL.ZS?end=2024&start=1991

More information about Unemployment Rate
https://www.studysmarter.co.uk/explanations/macroeconomics/economic-performance/unemployment-rate/


Information about data sources
# Unemployment, total (% of total labor force) (modeled ILO estimate)
# Definition:
#   Unemployment refers to the share of the labor force 
#   that is without work but available for and seeking employment.
# 
# Source:
#   ILO Modelled Estimates database (ILOEST), 
#   International Labour Organization (ILO), 
#   uri: https://ilostat.ilo.org/data/bulk/, 
#   publisher: ILOSTAT, 
#   type: external database, 
#   data accessed: January 07, 2025.
#
# GDP growth (annual %)
# Definition:
#   Gross domestic product is the total income earned through 
#   the production of goods and services in an economic territory 
#   during an accounting period. 
#   It can be measured in three different ways: 
#     using either the expenditure approach,
#     the income approach, 
#     or the production approach. 
#   This indicator denotes the percentage change over each previous year 
#   of the constant price (base year 2015) series in United States dollars.
# 
# Source:
# Country official statistics, National Statistical Organizations and/or Central Banks;
# National Accounts data files, Organisation for Economic Co-operation and Development (OECD);
# Staff estimates, World Bank (WB)

# Data was downloaded from the WB website.
# Data was slightly cleaned on Excel first.
