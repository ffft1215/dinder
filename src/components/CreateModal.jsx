import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import { Icon } from "@iconify/react";
import { useState } from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
} from "react-places-autocomplete";

export default function CreateModal({ setCreateModalOpen }) {
  const baseURL = "http://localhost:3001";

  const meals = ["Breakfast", "Lunch", "Dinner"];
  const locations = ["Carm", "Dewick", "Hodgdon"];
  const types = ["1 on 1", "Group of 3", "Group of 4"];
  const purposes = ["Chat", "Advice", "Other"];

  const [mealIndex, setMealIndex] = useState(-1);
  const [date, setDate] = useState(
    new Date(Math.round(new Date().getTime() / 60000) * 60000)
  );
  const [locationIndex, setLocationIndex] = useState(-1);
  const [typeIndex, setTypeIndex] = useState(-1);
  const [purposeIndex, setPurposeIndex] = useState(-1);

  const [locationAddress, setLocationAddress] = useState("");
  const [meetingLocation, setMeetingLocation] = useState("");

  const onCreateClick = async () => {
    if (
      mealIndex === -1 ||
      locationIndex === -1 ||
      typeIndex === -1 ||
      purposeIndex === -1 ||
      meetingLocation === ""
    ) {
      alert("Please finish selecting all the features for your new dinder");
    } else {
      const event = {
        mealType: meals[mealIndex],
        dateTime: date,
        location: locations[locationIndex],
        meetingLocation: meetingLocation,
        type: types[typeIndex],
        purpose: purposes[purposeIndex],
      };

      try {
        const response = await fetch(baseURL + "/events/add", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(event),
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data.message);

          setCreateModalOpen(false);
        } else {
          console.error("Error adding dinder:", response.statusText);
        }
      } catch (error) {
        console.error("Error adding dinder:", error.message);
      }
    }
  };

  const onLocationSelect = (address) => {
    setLocationAddress(address);
    geocodeByAddress(address)
      .then(async (results) => {
        setMeetingLocation(results[0].formatted_address);
      })
      .catch((error) => {
        console.error("Error", error);
      });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="ModalBackground-hosting">
        <div className="ModalContent-hosting">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ fontSize: 36, fontWeight: "700" }}>Create Dinder</div>
            <Icon
              icon={"ion:close-circle"}
              height={30}
              onClick={() => setCreateModalOpen(false)}
              style={{ color: "#929292", cursor: "pointer" }}
            />
          </div>
          <div style={{ fontSize: 20, fontWeight: "700" }}>Meal</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {meals.map((meal, index) => (
              <div
                key={index}
                className="HostingYellowContainer"
                style={{
                  backgroundColor:
                    mealIndex === index ? "rgba(242, 201, 76, 0.50)" : "#fff",
                }}
                onClick={() => setMealIndex(index)}
              >
                {meal}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 20, fontWeight: "700" }}>Date</div>
          <div style={{ display: "flex", gap: 10 }}>
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
              value={dayjs(new Date(date.getTime()))}
              onChange={(newValue) => {
                const date = dayjs(newValue).toDate();
                setDate(date);
              }}
            />
            <TimePicker
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
              value={dayjs(new Date(date.getTime()))}
              onChange={(newValue) => {
                const date = dayjs(newValue).toDate();
                setDate(date);
              }}
            />
          </div>
          <div style={{ fontSize: 20, fontWeight: "700" }}>Location</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {locations.map((location, index) => (
              <div
                key={index}
                className="HostingYellowContainer"
                style={{
                  backgroundColor:
                    locationIndex === index
                      ? "rgba(242, 201, 76, 0.50)"
                      : "#fff",
                }}
                onClick={() => setLocationIndex(index)}
              >
                {location}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 20, fontWeight: "700" }}>
            Meeting Location
          </div>
          <PlacesAutocomplete
            value={locationAddress}
            onChange={(address) => setLocationAddress(address)}
            onSelect={(address) => onLocationSelect(address)}
          >
            {({
              getInputProps,
              suggestions,
              getSuggestionItemProps,
              loading,
            }) => (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <input
                  style={{
                    backgroundColor: "white",
                    border: "1px solid black",
                    fontSize: 16,
                    cursor: "text",
                    color: "black",
                    boxShadow: "none",
                    borderRadius: 5,
                    padding: "10px 15px",
                  }}
                  {...getInputProps({
                    placeholder: "Choose Location",
                    className: "location-search-input",
                  })}
                />
                <div
                  style={{
                    width: "25%",
                    position: "absolute",
                    marginTop: 40,
                    zIndex: 99,
                    border: suggestions.length > 0 ? "0.5px solid #B9B9B9" : "",
                    borderRadius: 5,
                    backgroundColor: "white",
                  }}
                  className="autocomplete-dropdown-container"
                >
                  {loading && (
                    <div
                      style={{
                        color: "black",
                        display: "flex",
                        justifyContent: "center",
                        padding: 10,
                      }}
                    >
                      Loading...
                    </div>
                  )}
                  {suggestions.map((suggestion, index) => {
                    const className = suggestion.active
                      ? "suggestion-item--active"
                      : "suggestion-item";
                    const style = suggestion.active
                      ? { backgroundColor: "#fafafa", cursor: "pointer" }
                      : { backgroundColor: "#ffffff", cursor: "pointer" };
                    return (
                      <div
                        key={index}
                        {...getSuggestionItemProps(suggestion, {
                          className,
                          style,
                        })}
                        style={{ margin: 10, cursor: "pointer" }}
                      >
                        <span style={{ color: "black" }}>
                          {suggestion.description}
                        </span>
                        {index !== suggestions.length - 1 ? (
                          <hr
                            style={{
                              borderColor: "#EDEDED",
                              marginBlock: 5,
                            }}
                          />
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </PlacesAutocomplete>
          <div style={{ fontSize: 20, fontWeight: "700" }}>Dinder Type</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {types.map((type, index) => (
              <div
                key={index}
                className="HostingYellowContainer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 7,
                  backgroundColor:
                    typeIndex === index ? "rgba(242, 201, 76, 0.50)" : "#fff",
                }}
                onClick={() => setTypeIndex(index)}
              >
                {type === "1 on 1" ? (
                  <Icon icon={"octicon:person-24"} height={16} />
                ) : (
                  <Icon icon={"octicon:people-24"} height={16} />
                )}
                <span>{type}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 20, fontWeight: "700" }}>Purpose</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {purposes.map((purpose, index) => (
              <div
                key={index}
                className="HostingYellowContainer"
                style={{
                  backgroundColor:
                    purposeIndex === index
                      ? "rgba(242, 201, 76, 0.50)"
                      : "#fff",
                }}
                onClick={() => setPurposeIndex(index)}
              >
                {purpose}
              </div>
            ))}
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
            onClick={onCreateClick}
          >
            Create
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
}
