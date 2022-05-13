import * as React from 'react';
import ChartXY from "./Chart";
import { format, parseISO } from "date-fns";

import { getDataPoints } from "../api/api";
import { IMetricData } from "../interfaces";

interface IProps {
  title: string;
  metric: string;
  location: string;
}

/* TODO -
   - add hamburger menu to allow changing date range and location
     (ie, need to set startTime and endTime).
   - 
*/

export default function Indicator(props: IProps): JSX.Element {
  const [startTime, ] = React.useState(1583038800);    // default start = 3/1/2020; in seconds
  const [endTime, ] = React.useState(Math.floor(Date.now() / 1000)); // default end = now
  const [yAxisCounts, setYAxisCounts] = React.useState<number[]>([]);
  const [dateLabels, setDateLabels] = React.useState<string[]>([]);

  const basicChartData = [
    {
        label: props.title,
        fill: true,
        backgroundColor: "transparent",
        borderColor: "grey",
        data: yAxisCounts,
    },
  ];

  async function createChartData(input: IMetricData[]) {
    let countInEachColumn: number[] = [];
    switch (props.metric) {
      case "cases": countInEachColumn = input.map(item => item.new_cases_smoothed); break;
      case "deaths": countInEachColumn = input.map(item => item.new_deaths_smoothed); break;
      case "vacc": countInEachColumn = input.map(item => item.new_vaccinations_smoothed); break;
      case "hospital": countInEachColumn = input.map(item => item.hosp_patients); break;
      default: break;
    }

    const xAxisLabels = input.map(item => {
      const isoDate = parseISO(item.date);
      return format(isoDate, "PP");
    });    
    // console.log("countInEachColumn=", countInEachColumn, " xAxisLabels=", xAxisLabels);

    setYAxisCounts(countInEachColumn);
    setDateLabels(xAxisLabels);
  }

  const fetchData = async (
      metric: string,
      startTime: number,
      endTime: number,
      location: string
    ) => {
    
    const data = await getDataPoints(metric, startTime, endTime, location); // rtns array
    if (data) {
      await createChartData(data);
    }
  };

  React.useEffect(() => {
    fetchData(props.metric, startTime, endTime, props.location);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
      <div style=
        {{
          maxWidth: "95%",
          margin: 10,
          backgroundColor: "grey",
          borderRadius: 5,
          boxShadow: "0 3px 9px rgba(0, 0, 0, 0.5)"
        }}>
          <ChartXY 
              title={`${props.title} - ${props.location}`}
              data={basicChartData}
              labels={dateLabels}
          />
      </div>
  );
}
