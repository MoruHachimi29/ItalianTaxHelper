/**
 * API per i dati sul debito pubblico
 * Versione semplificata con dati mockati
 */

export const currentDebtData = {
  "Italy": {
    country: "Italy",
    debtValue: 2850.9,
    currency: "EUR",
    debtToGDP: 144.4,
    lastUpdate: "2023-12-31",
    trend: "up",
    changePercentage: 2.1
  },
  "Germany": {
    country: "Germany",
    debtValue: 2437.7,
    currency: "EUR",
    debtToGDP: 66.4,
    lastUpdate: "2023-12-31",
    trend: "down",
    changePercentage: -0.8
  },
  "France": {
    country: "France",
    debtValue: 3070.6,
    currency: "EUR",
    debtToGDP: 111.9,
    lastUpdate: "2023-12-31",
    trend: "up",
    changePercentage: 1.3
  },
  "Spain": {
    country: "Spain",
    debtValue: 1503.9,
    currency: "EUR",
    debtToGDP: 110.3,
    lastUpdate: "2023-12-31",
    trend: "up",
    changePercentage: 0.5
  }
};

export const historicalDebtData = {
  "Italy": {
    country: "Italy",
    currency: "EUR",
    data: [
      { year: 2015, debtValue: 2173.4, debtToGDP: 135.4 },
      { year: 2016, debtValue: 2220.4, debtToGDP: 134.8 },
      { year: 2017, debtValue: 2269.0, debtToGDP: 134.1 },
      { year: 2018, debtValue: 2380.9, debtToGDP: 134.4 },
      { year: 2019, debtValue: 2410.0, debtToGDP: 134.1 },
      { year: 2020, debtValue: 2573.5, debtToGDP: 155.6 },
      { year: 2021, debtValue: 2678.1, debtToGDP: 150.8 },
      { year: 2022, debtValue: 2757.9, debtToGDP: 144.7 },
      { year: 2023, debtValue: 2850.9, debtToGDP: 144.4 }
    ]
  },
  "Germany": {
    country: "Germany",
    currency: "EUR",
    data: [
      { year: 2015, debtValue: 2161.8, debtToGDP: 72.1 },
      { year: 2016, debtValue: 2152.9, debtToGDP: 69.2 },
      { year: 2017, debtValue: 2102.9, debtToGDP: 65.2 },
      { year: 2018, debtValue: 2063.2, debtToGDP: 61.7 },
      { year: 2019, debtValue: 2047.4, debtToGDP: 59.2 },
      { year: 2020, debtValue: 2328.3, debtToGDP: 69.1 },
      { year: 2021, debtValue: 2467.2, debtToGDP: 69.3 },
      { year: 2022, debtValue: 2456.2, debtToGDP: 67.2 },
      { year: 2023, debtValue: 2437.7, debtToGDP: 66.4 }
    ]
  },
  "France": {
    country: "France",
    currency: "EUR",
    data: [
      { year: 2015, debtValue: 2102.7, debtToGDP: 95.6 },
      { year: 2016, debtValue: 2188.5, debtToGDP: 98.0 },
      { year: 2017, debtValue: 2258.7, debtToGDP: 98.3 },
      { year: 2018, debtValue: 2315.3, debtToGDP: 98.0 },
      { year: 2019, debtValue: 2380.1, debtToGDP: 97.4 },
      { year: 2020, debtValue: 2650.1, debtToGDP: 115.0 },
      { year: 2021, debtValue: 2813.1, debtToGDP: 112.8 },
      { year: 2022, debtValue: 2950.2, debtToGDP: 111.8 },
      { year: 2023, debtValue: 3070.6, debtToGDP: 111.9 }
    ]
  },
  "Spain": {
    country: "Spain",
    currency: "EUR",
    data: [
      { year: 2015, debtValue: 1073.9, debtToGDP: 99.3 },
      { year: 2016, debtValue: 1107.2, debtToGDP: 99.2 },
      { year: 2017, debtValue: 1144.4, debtToGDP: 98.6 },
      { year: 2018, debtValue: 1173.3, debtToGDP: 97.4 },
      { year: 2019, debtValue: 1188.8, debtToGDP: 95.5 },
      { year: 2020, debtValue: 1345.7, debtToGDP: 120.0 },
      { year: 2021, debtValue: 1427.2, debtToGDP: 118.3 },
      { year: 2022, debtValue: 1450.3, debtToGDP: 112.8 },
      { year: 2023, debtValue: 1503.9, debtToGDP: 110.3 }
    ]
  }
};

export const comparisonData = {
  "Italy-Germany": {
    countries: ["Italy", "Germany"],
    data: [
      {
        country: "Italy",
        debtValue: 2850.9,
        currency: "EUR",
        debtToGDP: 144.4,
        perCapita: 48305
      },
      {
        country: "Germany",
        debtValue: 2437.7,
        currency: "EUR",
        debtToGDP: 66.4,
        perCapita: 29212
      }
    ],
    comparison: {
      relativeSize: 1.17,
      gdpComparison: 2.17,
      perCapitaRatio: 1.65
    }
  },
  "France-Germany": {
    countries: ["France", "Germany"],
    data: [
      {
        country: "France",
        debtValue: 3070.6,
        currency: "EUR",
        debtToGDP: 111.9,
        perCapita: 45837
      },
      {
        country: "Germany",
        debtValue: 2437.7,
        currency: "EUR",
        debtToGDP: 66.4,
        perCapita: 29212
      }
    ],
    comparison: {
      relativeSize: 1.26,
      gdpComparison: 1.68,
      perCapitaRatio: 1.57
    }
  },
  "Italy-France": {
    countries: ["Italy", "France"],
    data: [
      {
        country: "Italy",
        debtValue: 2850.9,
        currency: "EUR",
        debtToGDP: 144.4,
        perCapita: 48305
      },
      {
        country: "France",
        debtValue: 3070.6,
        currency: "EUR",
        debtToGDP: 111.9,
        perCapita: 45837
      }
    ],
    comparison: {
      relativeSize: 0.93,
      gdpComparison: 1.29,
      perCapitaRatio: 1.05
    }
  },
  "Italy-Spain": {
    countries: ["Italy", "Spain"],
    data: [
      {
        country: "Italy",
        debtValue: 2850.9,
        currency: "EUR",
        debtToGDP: 144.4,
        perCapita: 48305
      },
      {
        country: "Spain",
        debtValue: 1503.9,
        currency: "EUR",
        debtToGDP: 110.3,
        perCapita: 31845
      }
    ],
    comparison: {
      relativeSize: 1.90,
      gdpComparison: 1.31,
      perCapitaRatio: 1.52
    }
  }
};