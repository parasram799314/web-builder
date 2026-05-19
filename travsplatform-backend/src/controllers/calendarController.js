// src/controllers/calendarController.js

const COUNTRY_MAP = {
  india: "IN",
  uk: "GB",
  usa: "US",
  australia: "AU",
  canada: "CA",
  uae: "AE",
  germany: "DE",
  france: "FR",
  italy: "IT",
  spain: "ES",
  brazil: "BR",
  mexico: "MX",
  japan: "JP",
  china: "CN",
  russia: "RU",
  southafrica: "ZA",
  singapore: "SG",
  malaysia: "MY",
  thailand: "TH",
  indonesia: "ID",
  turkey: "TR",
  saudiarabia: "SA",
  netherlands: "NL",
  switzerland: "CH",
  sweden: "SE",
  norway: "NO",
  denmark: "DK",
  finland: "FI",
  ireland: "IE",
  newzealand: "NZ",
  portugal: "PT",
  greece: "GR",
  belgium: "BE",
  austria: "AT",
  poland: "PL",
  argentina: "AR",
  chile: "CL",
  colombia: "CO",
  peru: "PE",
  vietnam: "VN",
  southkorea: "KR",
  philippines: "PH",
  israel: "IL",
  egypt: "EG",
};

async function getHolidays(req, res) {
  try {
    const { countries, year } = req.query;

    if (!countries || !year) {
      return res.status(400).json({ error: "countries and year are required" });
    }

    const countryList = countries.split(",").map((c) => c.trim().toLowerCase());
    const allHolidays = {};

    // ✅ Parallel fetch — speed fix
    await Promise.all(
      countryList.map(async (countryName) => {
        const countryCode = COUNTRY_MAP[countryName];

        if (!countryCode) {
          console.warn(`⚠️ Unknown country: ${countryName}`);
          return;
        }

        try {
          const response = await fetch(
            `https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`
          );

          // ✅ Safe text parse — "Unexpected end of JSON" fix
          const text = await response.text();
          if (!text || text.trim() === "") {
            console.error(`❌ Empty response for ${countryName}`);
            return;
          }

          if (!response.ok) {
            console.error(`❌ HTTP ${response.status} for ${countryName}`);
            return;
          }

          const holidays = JSON.parse(text);

          allHolidays[countryName] = {};
          holidays.forEach((holiday) => {
            allHolidays[countryName][holiday.date] = {
              name: holiday.name,        // ✅ English name
              localName: holiday.localName, // optional: local language
              type: "Public Holiday",
            };
          });

          console.log(`✅ Fetched ${holidays.length} holidays for ${countryName}`);
        } catch (err) {
          console.error(`❌ Error fetching ${countryName}:`, err.message);
        }
      })
    );

    return res.json({ holidays: allHolidays });
  } catch (err) {
    console.error("getHolidays global error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { getHolidays };