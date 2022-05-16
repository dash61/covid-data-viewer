// TODO - need to use a generic interface here
import { ICovidData, ICountryData } from "../interfaces";


export async function getDataPoints(
  metric: string,   // type of data to get
  start: number,    // ts in secs
  stop: number,     // ts in secs
  location: string  // country or state or county code
): Promise<ICovidData[]> {
  try {
    const req: RequestInit = {
      body: JSON.stringify({
        freshenData: false,
        metric,
        start,
        stop,
        location
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    };
    const rsp = await fetch(`http://127.0.0.1:4000/getDataPoints`, req);
    // console.log("api rsp=", rsp);
    if (rsp.status === 200) {
        return await rsp.json();
    }
  } catch (err: unknown) {
    const errMsg = (err as Error)?.message;
    console.log("getting user data - EXCEPTION - err=", errMsg);
  }
  return [];
}

export async function getCountryData(): Promise<ICountryData[] | undefined> {
  try {
    const req: RequestInit = {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
    };
    const rsp = await fetch(`http://127.0.0.1:4000/getCountryData`, req);
    if (rsp.status === 200) {
        return await rsp.json();
    }
  } catch (err: unknown) {
    const errMsg = (err as Error)?.message;
    console.log("getting country names - EXCEPTION - err=", errMsg);
  }
  return undefined;
}

export async function getContinents(): Promise<string[]> {
  try {
    const req: RequestInit = {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
    };
    const rsp = await fetch(`http://127.0.0.1:4000/getContinents`, req);
    if (rsp.status === 200) {
        return await rsp.json();
    }
  } catch (err: unknown) {
    const errMsg = (err as Error)?.message;
    console.log("getting continents - EXCEPTION - err=", errMsg);
  }
  return [];
}

export async function getMetricNames(): Promise<string[]> {
  try {
    const req: RequestInit = {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
    };
    const rsp = await fetch(`http://127.0.0.1:4000/getMetricNames`, req);
    if (rsp.status === 200) {
        return await rsp.json();
    }
  } catch (err: unknown) {
    const errMsg = (err as Error)?.message;
    console.log("getting metric names - EXCEPTION - err=", errMsg);
  }
  return [];
}

// Get the same metric for each country.
export async function getOneMetric(
  metric: string,   // type of data to get
  date: number      // date of metric to get
): Promise<ICovidData[]> {
  try {
    const req: RequestInit = {
      body: JSON.stringify({ metric, date }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    };
    const rsp = await fetch(`http://127.0.0.1:4000/getOneMetric`, req);
    // console.log("api rsp=", rsp);
    if (rsp.status === 200) {
        return await rsp.json();
    }
  } catch (err: unknown) {
    const errMsg = (err as Error)?.message;
    console.log("getting one metric - EXCEPTION - err=", errMsg);
  }
  return [];
}
