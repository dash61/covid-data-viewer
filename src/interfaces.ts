
// CSV data from owid-covid-data.csv has these headers:
export interface ICovidData {
  _id: string;
  iso_code: string;
  continent: string;
  location: string;
  date: string; // DIFFERENT FROM SERVER; WE GET A STRING HERE
  total_cases: number;
  new_cases: number;
  new_cases_smoothed: number;
  total_deaths: number;
  new_deaths: number;
  new_deaths_smoothed: number;
  total_cases_per_million: number;
  new_cases_per_million: number;
  new_cases_smoothed_per_million: number;
  total_deaths_per_million: number;
  new_deaths_per_million: number;
  new_deaths_smoothed_per_million: number;
  reproduction_rate: number;
  icu_patients: number;
  icu_patients_per_million: number;
  hosp_patients: number;
  hosp_patients_per_million: number;
  weekly_icu_admissions: number;
  weekly_icu_admissions_per_million: number;
  weekly_hosp_admissions: number;
  weekly_hosp_admissions_per_million: number;
  total_tests: number;
  new_tests: number;
  total_tests_per_thousand: number;
  new_tests_per_thousand: number;
  new_tests_smoothed: number;
  new_tests_smoothed_per_thousand: number;
  positive_rate: number;
  tests_per_case: number;
  tests_units: string; // --------------- STRING
  total_vaccinations: number;
  people_vaccinated: number;
  people_fully_vaccinated: number;
  total_boosters: number;
  new_vaccinations: number;
  new_vaccinations_smoothed: number;
  total_vaccinations_per_hundred: number;
  people_vaccinated_per_hundred: number;
  people_fully_vaccinated_per_hundred: number;
  total_boosters_per_hundred: number;
  new_vaccinations_smoothed_per_million: number;
  new_people_vaccinated_smoothed: number;
  new_people_vaccinated_smoothed_per_hundred: number;
  stringency_index: number;
  population: number;
  population_density: number;
  median_age: number;
  aged_65_older: number;
  aged_70_older: number;
  gdp_per_capita: number;
  extreme_poverty: number;
  cardiovasc_death_rate: number;
  diabetes_prevalence: number;
  female_smokers: number;
  male_smokers: number;
  handwashing_facilities: number;
  hospital_beds_per_thousand: number;
  life_expectancy: number;
  human_development_index: number;
  excess_mortality_cumulative_absolute: number;
  excess_mortality_cumulative: number;
  excess_mortality: number;
  excess_mortality_cumulative_per_million: number;
  data: number; // dummy field to aid in mapping fields above to a 'data' attribute
}

export type IMetricData = Pick<ICovidData,
  "_id" | "date" | "new_deaths_smoothed" | "new_cases_smoothed" | "new_vaccinations_smoothed" | "hosp_patients">;

export type IAllMetrics = Exclude<ICovidData,
  "_id" | "iso_code" | "continent" | "location" | "date" | "tests_units">

// export type IAllMetricKeys = keyof IAllMetricsKV;

export interface ICountryData {
  _id: {
    location: string;
    iso_code: string;
  }
}

export enum DataSets {
  DataSet1 = 1,
  DataSet2 = 2,
}
