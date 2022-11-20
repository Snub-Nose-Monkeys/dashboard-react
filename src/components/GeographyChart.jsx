import { useTheme } from "@mui/material";
import { useMemo } from "react";
import { ResponsiveChoropleth } from "@nivo/geo";
import { geoFeatures } from "../data/mockGeoFeatures";
import { tokens } from "../theme";
// import { mockGeographyData as data } from "../data/mockData";
import { useGetPremiumSummaryQuery } from "../services/covid19";
import CircularProgress from '@mui/material/CircularProgress';
import { getCountryISO3 } from "../utils/getCountryISO3";

const GeographyChart = ({ isDashboard = false}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {data: summary, isFetching: isSummaryFetching, error} = useGetPremiumSummaryQuery();


  // Aviod to do huge comparision in each render
  const countries = useMemo(
    () =>{
      return summary?.Countries && summary.Countries.map(country => {
        return {
          id: getCountryISO3(country.Country, country.Slug),
          value: country.TotalConfirmed,
        }
    })
    }, [isSummaryFetching])


  return (
    isSummaryFetching ? <CircularProgress sx={{color: colors.greenAccent[600]}}/> : (<ResponsiveChoropleth
      data={countries || []}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
        tooltip: {
          container: {
            color: colors.primary[500],
          },
        },
        
      }}
      features={geoFeatures.features}
      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      colors="OrRd"
      domain={[0, 10000000]}
      unknownColor="#666666"
      label="properties.name"
      valueFormat=".2s"
      projectionScale={isDashboard ? 100 : 150}
      projectionTranslation={isDashboard ? [0.49, 0.6] : [0.5, 0.5]}
      projectionRotation={[0, 0, 0]}
      borderWidth={1.5}
      borderColor={colors.grey[200]}
      legends={[
              {
                anchor: "bottom-left",
                direction: "column",
                justify: true,
                translateX: 20,
                translateY: -50,
                itemsSpacing: 0,
                itemWidth: 94,
                itemHeight: 18,
                itemDirection: "left-to-right",
                itemTextColor: colors.grey[100],
                itemOpacity: 0.85,
                symbolSize: 18,
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemTextColor: "#ffffff",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]
      }
    />)
  );
};

export default GeographyChart;


