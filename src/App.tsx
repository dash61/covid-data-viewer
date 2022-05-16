import React from 'react';
import './App.css';
import './components/MapComponent/map.css';

import Typography from '@mui/material/Typography';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import Header from "./components/Header";
import Indicator from "./components/Indicator";
import { getMetricNames, getCountryData } from "./api/api";

import CustomMap from "./components/MapComponent/Map";

interface IProps {
  dummy?: number;
}

interface IState {
  country: string;
  metric: string;
  country2: string;
  metric2: string;
  allMetrics: string[];
  allCountries: string[];
  allCountryCodes: string[];
  loading: boolean;
}

class App extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      country: "",
      metric: "",
      country2: "",
      metric2: "",
      allMetrics: [],
      allCountries: [],
      allCountryCodes: [],
      loading: true,
    };
  }

  fetchData = async () => {
    const metrics = await getMetricNames(); // rtns array
    if (metrics) {
      this.setState({ allMetrics: metrics, metric: metrics[0], metric2: metrics[0] });
    }
    const countries = await getCountryData(); // rtns array
    if (countries) {
      const justCountries = countries.map(val => {
        return val._id.location;
      });
      this.setState({ allCountries: justCountries, country: justCountries[0], country2: justCountries[0] });
      const justCountryCodes = countries.map(val => {
        return val._id.iso_code;
      });
      this.setState({ allCountryCodes: justCountryCodes });
    }
  };

  // There's a one-to-one mapping of country names to country codes.
  private getCountryCodeForCountry = (country: string): string => {
    const index = this.state.allCountries.indexOf(country);
    if (index !== -1) {
      return this.state.allCountryCodes[index];
    }
    return "";
  }

  public async componentDidMount() {
    await this.fetchData();
  }

  private handleMetricChange = (event: SelectChangeEvent) => {
    this.setState({ metric: event.target.value });
  }

  private handleCountryChange = (event: SelectChangeEvent) => {
    this.setState({ country: event.target.value });
  }

  private handleMetric2Change = (event: SelectChangeEvent) => {
    this.setState({ metric2: event.target.value });
  }

  private handleCountry2Change = (event: SelectChangeEvent) => {
    this.setState({ country2: event.target.value });
  }

  private doneLoadingJson = () => {
    this.setState({loading: false});
  }

  public render (): JSX.Element {
    return (
      <div className="App">
        <Header />
        <div className="metric-banner">
          <section className="control-section" style={{ background: "rgba(0, 0, 255, 0.7)", marginBottom: 5 }}>
            <Typography
              variant="subtitle1"
              gutterBottom
              component="div"
              className="labels"
              sx={{ marginBottom: 0}}
            >
              Baseline:
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              component="div"
              className="labels"
              sx={{ marginBottom: 0}}
            >
              Metric
            </Typography>
            <Select
              id="metric-select"
              value={this.state.metric}
              onChange={this.handleMetricChange}
              sx={{ m: 1, minWidth: 120, color: "white" }}
              size="small"
            >
              { this.state.allMetrics.map((val, index) =>
                <MenuItem key={index} value={val}>{val}</MenuItem>
              )}
            </Select>
            <Typography
              variant="subtitle1"
              gutterBottom
              component="div"
              className="labels"
              sx={{ marginBottom: 0}}
            >
              Country
            </Typography>
            <Select
              id="country-select"
              value={this.state.country}
              onChange={this.handleCountryChange}
              sx={{ m: 1, minWidth: 120, color: "white" }}
              size="small"
            >
              { this.state.allCountries.map((val, index) =>
                <MenuItem key={index} value={val}>{val}</MenuItem>
              )}
            </Select>
          </section>
        </div>

        <div className="metric-banner">
          <section className="control-section" style={{ background: "rgba(255, 0, 0, 0.8)" }}>
            <Typography
              variant="subtitle1"
              gutterBottom
              component="div"
              className="labels"
              sx={{ marginBottom: 0}}
            >
              Compare To:
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              component="div"
              className="labels"
              sx={{ marginBottom: 0}}
            >
              Metric
            </Typography>
            <Select
              id="metric-select"
              value={this.state.metric2}
              onChange={this.handleMetric2Change}
              sx={{ m: 1, minWidth: 120, color: "white" }}
              size="small"
            >
              { this.state.allMetrics.map((val, index) =>
                <MenuItem key={index} value={val}>{val}</MenuItem>
              )}
            </Select>
            <Typography
              variant="subtitle1"
              gutterBottom
              component="div"
              className="labels"
              sx={{ marginBottom: 0}}
            >
              Country
            </Typography>
            <Select
              id="country-select"
              value={this.state.country2}
              onChange={this.handleCountry2Change}
              sx={{ m: 1, minWidth: 120, color: "white" }}
              size="small"
            >
              { this.state.allCountries.map((val, index) =>
                <MenuItem key={index} value={val}>{val}</MenuItem>
              )}
            </Select>
          </section>
        </div>

        <section style={{display: "flex", flexDirection: "column"}}>
          <Indicator
            title={this.state.metric}
            metric={this.state.metric}
            location={this.getCountryCodeForCountry(this.state.country)}
            title2={this.state.metric2}
            metric2={this.state.metric2}
            location2={this.getCountryCodeForCountry(this.state.country2)}
          />
          {/* 
          <Indicator title="Death Rates" metric="new_deaths_smoothed" location="USA" />
          <Indicator title="Vaccination Rates" metric="new_vaccinations_smoothed" location="USA" />
          <Indicator title="Hospitalization" metric="hosp_patients" location="USA" />
          */}
        </section>

        <section>

        <div>
            <div className="map-div">
              <CustomMap
                metric={this.state.metric}
                metric2={this.state.metric2}
                location={this.getCountryCodeForCountry(this.state.country)}
                location2={this.getCountryCodeForCountry(this.state.country2)}
                doneLoadingJson={this.doneLoadingJson}
              />
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default App;
