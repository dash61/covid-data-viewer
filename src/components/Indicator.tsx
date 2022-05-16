import * as React from 'react';
import ChartXY from "./Chart";
import { format, parseISO } from "date-fns";

import { getDataPoints } from "../api/api";
import { ICovidData, DataSets } from "../interfaces";
import { detectEmptyObject } from "../utils/utils";

interface IProps {
  title: string;
  title2?: string;
  metric: string;
  location: string;
  metric2?: string;
  location2?: string;
}

/* TODO -
   - add hamburger menu to allow changing date range and location
     (ie, need to set startTime and endTime).
   - 
*/
// let oneGraph = true;

export default function Indicator(props: IProps): JSX.Element {
  const [startTime, ] = React.useState(1583038800);    // default start = 3/1/2020; in seconds
  const [endTime, ] = React.useState(Math.floor(Date.now() / 1000)); // default end = now
  const [yAxisCounts1, setYAxisCounts1] = React.useState<number[]>([]);
  const [yAxisCounts2, setYAxisCounts2] = React.useState<number[]>([]);
  const [dateLabels, setDateLabels] = React.useState<string[]>([]);
  const [title, setTitle] = React.useState("");
  const [oneGraph, setOneGraph] = React.useState(true);

  const basicChartData = [
    {
      label: props.title,
      fill: true,
      backgroundColor: "transparent",
      borderColor: "blue",
      data: yAxisCounts1,
    },
    {
      label: props.title2,
      fill: true,
      backgroundColor: "transparent",
      borderColor: "red",
      data: yAxisCounts2,
    },
  ];

  async function createChartData(input: ICovidData[], which: DataSets) {
    let countInEachColumn: number[] = [];
    countInEachColumn = input.map(item => {
      const field = item.data;
      return (item as any)[field]; // not sure why this is needed; fix this
    });

    const xAxisLabels = input.map(item => {
      const isoDate = parseISO(item.date);
      return format(isoDate, "PP");
    });    
    // console.log("countInEachColumn=", countInEachColumn, " xAxisLabels=", xAxisLabels);

    if (which === DataSets.DataSet1) {
      setYAxisCounts1(countInEachColumn);
      setDateLabels(xAxisLabels);
    } else {
      setYAxisCounts2(countInEachColumn);
    }
  }

  const fetchData = React.useCallback(async (
    metric: string,
    startTime: number,
    endTime: number,
    location: string,
    which: DataSets
  ) => {
    // console.log("(indicator) metric = ", metric, startTime, endTime, location);
    const data = await getDataPoints(metric, startTime, endTime, location);
    if (data && !detectEmptyObject(data)) {
      await createChartData(data, which);
      return data;
    }
  }, []);

  React.useEffect(() => {
    fetchData(props.metric, startTime, endTime, props.location, DataSets.DataSet1);
    setTitle(`${props.title} - ${props.location}`);
    if (props.metric2 && props.location2) {
      if (props.metric !== props.metric2 || props.location !== props.location2) {
        // console.log("indicator.tsx - oneGraph=false");
        setOneGraph(false);
        fetchData(props.metric2, startTime, endTime, props.location2, DataSets.DataSet2);
        setTitle(`${props.title} - ${props.location}  /  ${props.title2} - ${props.location2}`);
      } else {
        setOneGraph(true);
      }
    }
  }, [props.metric, props.metric2, props.location, props.location2,
      startTime, endTime, fetchData, props.title, props.title2]);

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
              title={title}
              data={basicChartData}
              labels={dateLabels}
              oneGraph={oneGraph}
          />
      </div>
  );
}
