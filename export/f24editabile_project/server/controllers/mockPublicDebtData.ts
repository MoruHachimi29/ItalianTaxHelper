// Dati di esempio per il debito pubblico
// Questi dati verranno utilizzati solo per il testing dell'interfaccia quando OpenAI API non è disponibile

// Definizione dei tipi
export interface CurrentDebtItem {
  country: string;
  debtValue: number;
  currency: string;
  debtToGDP: number;
  lastUpdate: string;
  trend: 'up' | 'down';
  changePercentage: number;
}

export interface HistoricalDebtItem {
  country: string;
  currency: string;
  data: Array<{
    year: number;
    debtValue: number;
    debtToGDP: number;
  }>;
}

export interface ComparisonDebtItem {
  countries: string[];
  data: Array<{
    country: string;
    debtValue: number;
    currency: string;
    debtToGDP: number;
    perCapita: number;
  }>;
  comparison: {
    relativeSize: number;
    gdpComparison: number;
    perCapitaRatio: number;
  };
}

// Dati attuali del debito pubblico per paese
export const currentDebtData: Record<string, CurrentDebtItem> = {
  "Italia": {
    "country": "Italia",
    "debtValue": 2843.2,
    "currency": "EUR",
    "debtToGDP": 143.7,
    "lastUpdate": "31 marzo 2025",
    "trend": "up",
    "changePercentage": 1.8
  },
  "Germania": {
    "country": "Germania",
    "debtValue": 2476.3,
    "currency": "EUR",
    "debtToGDP": 65.8,
    "lastUpdate": "31 marzo 2025",
    "trend": "down",
    "changePercentage": 0.7
  },
  "Francia": {
    "country": "Francia",
    "debtValue": 3091.5,
    "currency": "EUR",
    "debtToGDP": 111.2,
    "lastUpdate": "31 marzo 2025",
    "trend": "up",
    "changePercentage": 2.1
  },
  "Regno Unito": {
    "country": "Regno Unito",
    "debtValue": 2520.6,
    "currency": "GBP",
    "debtToGDP": 97.3,
    "lastUpdate": "31 marzo 2025",
    "trend": "up",
    "changePercentage": 1.2
  },
  "Stati Uniti": {
    "country": "Stati Uniti",
    "debtValue": 34214.0,
    "currency": "USD",
    "debtToGDP": 127.9,
    "lastUpdate": "31 marzo 2025",
    "trend": "up",
    "changePercentage": 3.5
  },
  "Giappone": {
    "country": "Giappone",
    "debtValue": 1410321.0,
    "currency": "JPY",
    "debtToGDP": 261.2,
    "lastUpdate": "31 marzo 2025",
    "trend": "up",
    "changePercentage": 1.9
  },
  "Cina": {
    "country": "Cina",
    "debtValue": 51780.6,
    "currency": "CNY",
    "debtToGDP": 78.9,
    "lastUpdate": "31 marzo 2025",
    "trend": "up",
    "changePercentage": 4.2
  },
  "Spagna": {
    "country": "Spagna",
    "debtValue": 1565.4,
    "currency": "EUR",
    "debtToGDP": 107.8,
    "lastUpdate": "31 marzo 2025",
    "trend": "up",
    "changePercentage": 1.4
  },
  "Canada": {
    "country": "Canada",
    "debtValue": 1320.7,
    "currency": "CAD",
    "debtToGDP": 98.6,
    "lastUpdate": "31 marzo 2025",
    "trend": "up",
    "changePercentage": 2.3
  },
  "Brasile": {
    "country": "Brasile",
    "debtValue": 7892.4,
    "currency": "BRL",
    "debtToGDP": 85.4,
    "lastUpdate": "31 marzo 2025",
    "trend": "up",
    "changePercentage": 3.2
  },
  "India": {
    "country": "India",
    "debtValue": 153428.2,
    "currency": "INR",
    "debtToGDP": 83.2,
    "lastUpdate": "31 marzo 2025",
    "trend": "up",
    "changePercentage": 2.7
  },
  "Australia": {
    "country": "Australia",
    "debtValue": 945.2,
    "currency": "AUD",
    "debtToGDP": 57.3,
    "lastUpdate": "31 marzo 2025",
    "trend": "down",
    "changePercentage": 0.9
  },
  "Russia": {
    "country": "Russia",
    "debtValue": 28743.6,
    "currency": "RUB",
    "debtToGDP": 21.4,
    "lastUpdate": "31 marzo 2025",
    "trend": "up",
    "changePercentage": 1.7
  },
  "Svizzera": {
    "country": "Svizzera",
    "debtValue": 293.8,
    "currency": "CHF",
    "debtToGDP": 39.2,
    "lastUpdate": "31 marzo 2025",
    "trend": "down",
    "changePercentage": 0.5
  }
};

// Dati storici per paese
export const historicalDebtData: Record<string, HistoricalDebtItem> = {
  "Italia": {
    "country": "Italia",
    "currency": "EUR",
    "data": [
      { "year": 2010, "debtValue": 1851.2, "debtToGDP": 115.3 },
      { "year": 2011, "debtValue": 1907.5, "debtToGDP": 116.5 },
      { "year": 2012, "debtValue": 1990.0, "debtToGDP": 123.4 },
      { "year": 2013, "debtValue": 2070.3, "debtToGDP": 129.0 },
      { "year": 2014, "debtValue": 2137.6, "debtToGDP": 131.8 },
      { "year": 2015, "debtValue": 2173.4, "debtToGDP": 131.5 },
      { "year": 2016, "debtValue": 2220.7, "debtToGDP": 131.3 },
      { "year": 2017, "debtValue": 2269.0, "debtToGDP": 131.2 },
      { "year": 2018, "debtValue": 2380.9, "debtToGDP": 132.1 },
      { "year": 2019, "debtValue": 2409.8, "debtToGDP": 134.4 },
      { "year": 2020, "debtValue": 2573.5, "debtToGDP": 155.3 },
      { "year": 2021, "debtValue": 2678.1, "debtToGDP": 150.8 },
      { "year": 2022, "debtValue": 2757.3, "debtToGDP": 144.4 },
      { "year": 2023, "debtValue": 2762.9, "debtToGDP": 143.5 },
      { "year": 2024, "debtValue": 2789.4, "debtToGDP": 142.9 },
      { "year": 2025, "debtValue": 2843.2, "debtToGDP": 143.7 }
    ]
  },
  "Germania": {
    "country": "Germania",
    "currency": "EUR",
    "data": [
      { "year": 2010, "debtValue": 2079.6, "debtToGDP": 82.4 },
      { "year": 2011, "debtValue": 2125.8, "debtToGDP": 79.8 },
      { "year": 2012, "debtValue": 2196.2, "debtToGDP": 81.1 },
      { "year": 2013, "debtValue": 2190.8, "debtToGDP": 78.7 },
      { "year": 2014, "debtValue": 2192.4, "debtToGDP": 75.7 },
      { "year": 2015, "debtValue": 2161.8, "debtToGDP": 72.1 },
      { "year": 2016, "debtValue": 2152.0, "debtToGDP": 69.2 },
      { "year": 2017, "debtValue": 2119.7, "debtToGDP": 65.0 },
      { "year": 2018, "debtValue": 2070.0, "debtToGDP": 61.9 },
      { "year": 2019, "debtValue": 2057.3, "debtToGDP": 59.6 },
      { "year": 2020, "debtValue": 2325.5, "debtToGDP": 68.7 },
      { "year": 2021, "debtValue": 2467.2, "debtToGDP": 69.3 },
      { "year": 2022, "debtValue": 2510.6, "debtToGDP": 66.1 },
      { "year": 2023, "debtValue": 2493.8, "debtToGDP": 63.6 },
      { "year": 2024, "debtValue": 2485.1, "debtToGDP": 63.8 },
      { "year": 2025, "debtValue": 2476.3, "debtToGDP": 62.8 }
    ]
  },
  "Stati Uniti": {
    "country": "Stati Uniti",
    "currency": "USD",
    "data": [
      { "year": 2010, "debtValue": 13561.6, "debtToGDP": 91.4 },
      { "year": 2011, "debtValue": 14790.3, "debtToGDP": 95.7 },
      { "year": 2012, "debtValue": 16055.1, "debtToGDP": 99.9 },
      { "year": 2013, "debtValue": 16719.4, "debtToGDP": 100.8 },
      { "year": 2014, "debtValue": 17794.5, "debtToGDP": 102.7 },
      { "year": 2015, "debtValue": 18120.1, "debtToGDP": 101.0 },
      { "year": 2016, "debtValue": 19539.5, "debtToGDP": 103.2 },
      { "year": 2017, "debtValue": 20205.7, "debtToGDP": 103.8 },
      { "year": 2018, "debtValue": 21516.1, "debtToGDP": 104.9 },
      { "year": 2019, "debtValue": 23201.4, "debtToGDP": 106.9 },
      { "year": 2020, "debtValue": 27748.0, "debtToGDP": 132.8 },
      { "year": 2021, "debtValue": 29617.0, "debtToGDP": 128.1 },
      { "year": 2022, "debtValue": 30928.0, "debtToGDP": 122.1 },
      { "year": 2023, "debtValue": 32310.0, "debtToGDP": 123.4 },
      { "year": 2024, "debtValue": 33586.0, "debtToGDP": 125.8 },
      { "year": 2025, "debtValue": 34214.0, "debtToGDP": 127.9 }
    ]
  }
};

// Dati di confronto tra paesi
export const comparisonData: Record<string, ComparisonDebtItem> = {
  "Italia-Germania": {
    "countries": ["Italia", "Germania"],
    "data": [
      {
        "country": "Italia",
        "debtValue": 2843.2,
        "currency": "EUR",
        "debtToGDP": 143.7,
        "perCapita": 48210
      },
      {
        "country": "Germania",
        "debtValue": 2476.3,
        "currency": "EUR",
        "debtToGDP": 62.8,
        "perCapita": 29652
      }
    ],
    "comparison": {
      "relativeSize": 1.15,
      "gdpComparison": 80.9,
      "perCapitaRatio": 1.63
    }
  },
  "Italia-Francia": {
    "countries": ["Italia", "Francia"],
    "data": [
      {
        "country": "Italia",
        "debtValue": 2843.2,
        "currency": "EUR",
        "debtToGDP": 143.7,
        "perCapita": 48210
      },
      {
        "country": "Francia",
        "debtValue": 3091.5,
        "currency": "EUR",
        "debtToGDP": 111.2,
        "perCapita": 45320
      }
    ],
    "comparison": {
      "relativeSize": 0.92,
      "gdpComparison": 32.5,
      "perCapitaRatio": 1.06
    }
  },
  "Italia-Stati Uniti": {
    "countries": ["Italia", "Stati Uniti"],
    "data": [
      {
        "country": "Italia",
        "debtValue": 2843.2,
        "currency": "EUR",
        "debtToGDP": 143.7,
        "perCapita": 48210
      },
      {
        "country": "Stati Uniti",
        "debtValue": 31725.8,
        "currency": "EUR",
        "debtToGDP": 127.9,
        "perCapita": 95420
      }
    ],
    "comparison": {
      "relativeSize": 0.09,
      "gdpComparison": 15.8,
      "perCapitaRatio": 0.51
    }
  }
};