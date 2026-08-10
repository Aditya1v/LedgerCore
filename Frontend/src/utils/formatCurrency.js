const BASE_CURRENCY = "INR";

const RATES_KEY = "ledgercore-currency-rates";
const SETTINGS_KEY = "ledgercore-settings";

const FALLBACK_RATES = {
  INR: 1,
  USD: 0.0104823,
  EUR: 0.00908934,
  GBP: 0.00775961,
};

const CURRENCY_CONFIG = {
  INR: {
    locale: "en-IN",
    fractionDigits: 2,
  },
  USD: {
    locale: "en-US",
    fractionDigits: 2,
  },
  EUR: {
    locale: "de-DE",
    fractionDigits: 2,
  },
  GBP: {
    locale: "en-GB",
    fractionDigits: 2,
  },
};

export function getSelectedCurrency() {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);

    const currency = stored
      ? JSON.parse(stored)?.currency
      : BASE_CURRENCY;

    return CURRENCY_CONFIG[currency]
      ? currency
      : BASE_CURRENCY;
  } catch {
    return BASE_CURRENCY;
  }
}

export function getCurrencyRate(
  currency = getSelectedCurrency()
) {
  if (currency === BASE_CURRENCY) {
    return 1;
  }

  try {
    const stored = localStorage.getItem(RATES_KEY);

    const rates = stored
      ? JSON.parse(stored)
      : {};

    const rate = Number(rates[currency]);

    if (Number.isFinite(rate) && rate > 0) {
      return rate;
    }
  } catch {
    // Use fallback rate below.
  }

  return FALLBACK_RATES[currency] || 1;
}

export function convertFromBase(
  amount,
  currency = getSelectedCurrency()
) {
  const numericAmount = Number(amount) || 0;

  return numericAmount * getCurrencyRate(currency);
}

export function convertToBase(
  amount,
  currency = getSelectedCurrency()
) {
  const numericAmount = Number(amount) || 0;

  const rate = getCurrencyRate(currency);

  return rate > 0
    ? numericAmount / rate
    : numericAmount;
}

export function getCurrencySymbol(
  currency = getSelectedCurrency()
) {
  return new Intl.NumberFormat(
    CURRENCY_CONFIG[currency]?.locale || "en-IN",
    {
      style: "currency",
      currency,
      currencyDisplay: "narrowSymbol",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }
  )
    .formatToParts(0)
    .find((part) => part.type === "currency")
    ?.value || currency;
}

export function formatCurrency(
  amount,
  currency = getSelectedCurrency()
) {
  const safeCurrency = CURRENCY_CONFIG[currency]
    ? currency
    : BASE_CURRENCY;

  const convertedAmount = convertFromBase(
    amount,
    safeCurrency
  );

  const config = CURRENCY_CONFIG[safeCurrency];

  return new Intl.NumberFormat(config.locale, {
    style: "currency",
    currency: safeCurrency,
    minimumFractionDigits: config.fractionDigits,
    maximumFractionDigits: config.fractionDigits,
  }).format(convertedAmount);
}

export async function refreshCurrencyRates() {
  try {
    const response = await fetch(
      "https://api.frankfurter.app/latest?from=INR&to=USD,EUR,GBP"
    );

    if (!response.ok) {
      throw new Error(
        `Currency rate request failed: ${response.status}`
      );
    }

    const data = await response.json();

    const rates = {
      INR: 1,
      USD:
        Number(data.rates?.USD) ||
        FALLBACK_RATES.USD,
      EUR:
        Number(data.rates?.EUR) ||
        FALLBACK_RATES.EUR,
      GBP:
        Number(data.rates?.GBP) ||
        FALLBACK_RATES.GBP,
    };

    localStorage.setItem(
      RATES_KEY,
      JSON.stringify(rates)
    );

    localStorage.setItem(
      "ledgercore-currency-rates-updated-at",
      new Date().toISOString()
    );

    return rates;
  } catch (error) {
    console.warn(
      "Using fallback currency rates:",
      error
    );

    localStorage.setItem(
      RATES_KEY,
      JSON.stringify(FALLBACK_RATES)
    );

    return FALLBACK_RATES;
  }
}