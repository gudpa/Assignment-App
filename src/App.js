import "./App.css";
import data from "./data.json";
import { useMemo } from "react";

function App() {
  const classes = Math.max(...data.map((el) => +el.Alcohol));
  const segregated = new Array(classes).fill().map((e) => []);

  data.forEach((entry) => {
    entry["Gamma"] = +((+entry.Ash * +entry.Hue) / +entry.Magnesium).toFixed(3);
    segregated[entry.Alcohol - 1].push(entry);
  });

  const sortedSegregated = segregated.map((el) => {
    return el.sort((a, b) => +a.Flavanoids - +b.Flavanoids);
  });

  const sortedGammaSegregated = segregated.map((el) => {
    return el.sort((a, b) => +a.Gamma - +b.Gamma);
  });

  const findMode = (arr, key) => {
    let obj = {};
    let max;
    let maxFrequency = -Infinity;
    for (let i = 0; i < arr.length; i++) {
      let temp = arr[i][key];
      if (obj[temp]) {
        obj[temp]++;
      } else {
        obj[temp] = 1;
      }
    }
    let keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      if (maxFrequency < obj[keys[i]]) {
        max = keys[i];
        maxFrequency = obj[keys[i]];
      }
    }
    return max;
  };

  const flavanoidsData = useMemo(() => {
    return sortedSegregated.reduce(
      (acc, e, index) => {
        let n = e.length;
        const flavanoideSum = e.reduce((acc2, e2) => acc2 + +e2.Flavanoids, 0);
        const flavanoideAvg = flavanoideSum / n;
        acc.flavanoideMean[index] = flavanoideAvg.toFixed(3);
        acc.flavanoideMedian[index] =
          n % 2 === 0
            ? ((e[n / 2 - 1].Flavanoids + e[n / 2].Flavanoids) / 2).toFixed(3)
            : e[n / 2 - 0.5].Flavanoids.toFixed(3);
        acc.flavanoideMode[index] = findMode(e, "Flavanoids");
        return acc;
      },
      {
        flavanoideMean: new Array(sortedSegregated.length),
        flavanoideMedian: new Array(sortedSegregated.length),
        flavanoideMode: new Array(sortedSegregated.length),
      }
    );
  }, [data]);

  const gammaData = useMemo(() => {
    return sortedGammaSegregated.reduce(
      (acc, e, index) => {
        let n = e.length;
        const gammaSum = e.reduce((acc2, e2) => acc2 + +e2.Gamma, 0);
        const gammaAvg = gammaSum / n;
        acc.gammaMean[index] = gammaAvg.toFixed(3);
        acc.gammaMedian[index] =
          n % 2 === 0
            ? (e[n / 2 - 1].Gamma + e[n / 2].Gamma) / 2
            : e[n / 2 - 0.5].Gamma;
        acc.gammaMode[index] = findMode(e, "Gamma");
        return acc;
      },
      {
        gammaMean: new Array(sortedSegregated.length),
        gammaMedian: new Array(sortedSegregated.length),
        gammaMode: new Array(sortedSegregated.length),
      }
    );
  }, [data]);

  return (
    <>
      <table>
        <tbody>
          <tr>
            <th>Measure</th>
            {new Array(classes).fill().map((e, i) => (
              <th>Class {i + 1}</th>
            ))}
          </tr>
          <tr>
            <th>Flavanoids Mean</th>
            {flavanoidsData.flavanoideMean.map((el) => (
              <td>{el}</td>
            ))}
          </tr>
          <tr>
            <th>Flavanoids Median</th>
            {flavanoidsData.flavanoideMedian.map((el) => (
              <td>{el}</td>
            ))}
          </tr>
          <tr>
            <th>Flavanoids Mode</th>
            {flavanoidsData.flavanoideMode.map((el) => (
              <td>{el}</td>
            ))}
          </tr>
        </tbody>
      </table>
      <table>
        <tbody>
          <tr>
            <th>Measure</th>
            {new Array(classes).fill().map((e, i) => (
              <th>Class {i + 1}</th>
            ))}
          </tr>
          <tr>
            <th>Gamma Mean</th>
            {gammaData.gammaMean.map((el) => (
              <td>{el}</td>
            ))}
          </tr>
          <tr>
            <th>Gamma Median</th>
            {gammaData.gammaMedian.map((el) => (
              <td>{el}</td>
            ))}
          </tr>
          <tr>
            <th>Gamma Mode</th>
            {gammaData.gammaMode.map((el) => (
              <td>{el}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </>
  );
}

export default App;
