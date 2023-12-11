import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { Icon } from "@iconify/react";
import { useState } from "react";

export default function ExploreFilter({
  meals,
  locations,
  years,
  purposes,
  mealIndexes,
  date,
  locationIndexes,
  yearIndexes,
  purposeIndexes,
  setMealIndexes,
  setDate,
  setLocationIndexes,
  setYearIndexes,
  setPurposeIndexes,
  setFilterOpen,
}) {
  const [tempMealIndexes, setTempMealIndexes] = useState(mealIndexes);
  const [tempDate, setTempDate] = useState(date);
  const [tempLocationIndexes, setTempLocationIndexes] =
    useState(locationIndexes);
  const [tempYearIndexes, setTempYearIndexes] = useState(yearIndexes);
  const [tempPurposeIndexes, setTempPurposeIndexes] = useState(purposeIndexes);

  const onFilterClick = () => {
    setMealIndexes(tempMealIndexes);
    setDate(tempDate);
    setLocationIndexes(tempLocationIndexes);
    setYearIndexes(tempYearIndexes);
    setPurposeIndexes(tempPurposeIndexes);
    setFilterOpen(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="ModalBackground">
        <div className="ModalContent-explore">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ fontSize: 36, fontWeight: "700" }}>Filter by</div>
            <Icon
              icon={"ion:close-circle"}
              height={30}
              onClick={() => setFilterOpen(false)}
              style={{ color: "#929292", cursor: "pointer" }}
            />
          </div>
          <div style={{ fontSize: 20, fontWeight: "700" }}>Meal</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {meals.map((meal, index) => (
              <div
                key={index}
                className="ExploreYellowContainer"
                style={{
                  backgroundColor: tempMealIndexes.includes(index)
                    ? "rgba(242, 201, 76, 0.50)"
                    : "#fff",
                }}
                onClick={() =>
                  setTempMealIndexes(
                    tempMealIndexes.includes(index)
                      ? tempMealIndexes.filter(
                          (mealIndex) => mealIndex !== index
                        )
                      : [...tempMealIndexes, index]
                  )
                }
              >
                {meal}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 20, fontWeight: "700" }}>Date</div>
          <DatePicker
            slotProps={{
              textField: {
                size: "small",
                inputProps: {
                  style: {
                    color: "black",
                    boxShadow: "none",
                  },
                },
                sx: {
                  "& fieldset": {
                    border: "1px solid black",
                  },
                  "& .MuiButtonBase-root": {
                    color: "#929292",
                  },
                },
              },
            }}
            disablePast
            value={dayjs(tempDate)}
            onChange={(newValue) => {
              const date = dayjs(newValue).toDate();
              setTempDate(date);
            }}
          />
          <div style={{ fontSize: 20, fontWeight: "700" }}>Location</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {locations.map((location, index) => (
              <div
                key={index}
                className="ExploreYellowContainer"
                style={{
                  backgroundColor: tempLocationIndexes.includes(index)
                    ? "rgba(242, 201, 76, 0.50)"
                    : "#fff",
                }}
                onClick={() =>
                  setTempLocationIndexes(
                    tempLocationIndexes.includes(index)
                      ? tempLocationIndexes.filter(
                          (locationIndex) => locationIndex !== index
                        )
                      : [...tempLocationIndexes, index]
                  )
                }
              >
                {location}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 20, fontWeight: "700" }}>Year</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {years.map((year, index) => (
              <div
                key={index}
                className="ExploreYellowContainer"
                style={{
                  backgroundColor: tempYearIndexes.includes(index)
                    ? "rgba(242, 201, 76, 0.50)"
                    : "#fff",
                }}
                onClick={() =>
                  setTempYearIndexes(
                    tempYearIndexes.includes(index)
                      ? tempYearIndexes.filter(
                          (yearIndex) => yearIndex !== index
                        )
                      : [...tempYearIndexes, index]
                  )
                }
              >
                {year}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 20, fontWeight: "700" }}>Purpose</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {purposes.map((purpose, index) => (
              <div
                key={index}
                className="ExploreYellowContainer"
                style={{
                  backgroundColor: tempPurposeIndexes.includes(index)
                    ? "rgba(242, 201, 76, 0.50)"
                    : "#fff",
                }}
                onClick={() =>
                  setTempPurposeIndexes(
                    tempPurposeIndexes.includes(index)
                      ? tempPurposeIndexes.filter(
                          (purposeIndex) => purposeIndex !== index
                        )
                      : [...tempPurposeIndexes, index]
                  )
                }
              >
                {purpose}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Icon
              icon={"uil:lock"}
              height={24}
              style={{ color: "#8B949E", marginBottom: 2 }}
            />
            <div style={{ color: "#8B949E", fontSize: 14 }}>
              Upgrade to Premium for more filters
            </div>
          </div>
          <div
            style={{
              paddingBlock: 12,
              borderRadius: 10,
              fontWeight: "700",
              backgroundColor: "#333",
              color: "white",
              textAlign: "center",
              cursor: "pointer",
            }}
            onClick={onFilterClick}
          >
            Filter
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
}
