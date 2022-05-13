// TODO - need to use a generic interface here
import { IMetricData } from "../interfaces";


export async function getDataPoints(
  metric: string,   // type of data to get
  start: number,    // ts in secs
  stop: number,     // ts in secs
  location: string  // country or state or county code
): Promise<IMetricData[] | undefined> {
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
  return undefined;
}