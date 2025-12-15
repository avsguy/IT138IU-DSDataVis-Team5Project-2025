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


library(here)
library(tidyverse)

here::i_am("dataCleaning\\dataprep.R")

# LOAD FILES
rate_raw <- read.csv(
  here("dataCleaning", "unemp_worldgdp.csv"), 
  header = TRUE, 
  stringsAsFactors = FALSE) 
meta <- read.csv(
  here("dataCleaning", "metadata.csv"), 
  header = TRUE, 
  stringsAsFactors = FALSE)

# DATA CLEANING
rate_raw <- rate_raw %>% set_names(~ str_replace_all(., "^X", ""))
rate_NA <- rate_raw %>% filter(if_any(everything(), is.na)) # separate data with NA
rate_rmNA <- na.omit(rate_raw) # remove NA

# JOIN DATA
## data_na <- inner_join(
##  rate_NA, meta, by=c("CountryCode", "CountryName"), suffix=c("_NA", "_meta"))
## just need rates with data, don't need metadata that are not connected with rates
data_rmNA <- left_join(
  rate_rmNA, meta, by=c("CountryCode", "CountryName"), suffix=c("_rate", "_meta"))

# OTHER METRICS
## region, income, world
otherMetrics <- data_rmNA %>%
  filter(if_any("Region", ~ is.na(.) | (is.character(.) & . == "")))
## Cote d'lvoire, Sao Tome and Principe, Turkiye, Virgin Islands
otherCountry <- otherMetrics[c(5, 42, 49, 51),]
otherMetric <- otherMetrics[-c(5, 42, 49, 51),] # remove country
otherMetric <- subset(otherMetric, select = -c(Region, IncomeGroup)) # remove col

# COUNTRY ONLY
## get all countries with regions + 4 other countries
country_data_withregion <- data_rmNA %>% 
  filter(!if_any("Region", ~ is.na(.) | (is.character(.) & . == "")))
countryData <- bind_rows(country_data_withregion, otherCountry)
countryData <- arrange(countryData, CountryName)

# prepare for data visualization - pivot longer
countryData <- countryData  %>% pivot_longer(
  cols = -c("CountryName", "CountryCode", "Region", "IncomeGroup", "SpecialNotes"),
  names_to = "Date",
  values_to = "UnempRate"
)
otherMetric <- otherMetric  %>% pivot_longer(
  cols = -c("CountryName", "CountryCode", "SpecialNotes"),
  names_to = "Date",
  values_to = "Rate"
)

# add avg rate
countryData <- countryData %>%
  group_by(CountryName) %>%
  mutate(avgRateperCountry = mean(UnempRate, na.rm=TRUE)) %>%
  ungroup()

otherMetric <- otherMetric %>%
  group_by(CountryName) %>%
  mutate(avgRateperMetric = mean(Rate, na.rm=TRUE)) %>%
  ungroup()

# WRITE 
write.csv(countryData, 
          here("dataCleaning", "country.csv"), 
          row.names = FALSE)
write.csv(otherMetric, 
          here("dataCleaning", "metric.csv"), 
          row.names = FALSE)
