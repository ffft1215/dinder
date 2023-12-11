import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import "../styles/MyProfile.css";

export default function MyProfile() {
  const [profileData, setProfileData] = useState(null);

  const baseURL = "http://localhost:3001";

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(baseURL + "/users/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProfileData(data.user);
        } else {
          console.error("Error fetching profile data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error.message);
      }
    };

    fetchProfileData();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="MainProfileContainer">
        <div className="ProfileText">
          <h1>My Profile</h1>
        </div>
        <div className="PicNameContainer">
          <div className="PicName">
            <div className="Pic">
              <button className="PicEdit">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M13.7658 1.78353C14.62 0.929253 16.005 0.929255 16.8593 1.78353L18.2165 3.14077C19.0708 3.99503 19.0708 5.38008 18.2165 6.23435L7.45448 16.9964C7.1916 17.2593 6.86608 17.4508 6.50863 17.5529L2.44508 18.7139C2.1177 18.8076 1.76537 18.7162 1.52462 18.4754C1.28387 18.2347 1.19256 17.8824 1.28609 17.5551L2.44712 13.4914C2.54924 13.1341 2.74078 12.8084 3.00365 12.5456L13.7658 1.78353ZM15.5335 3.10935C15.4114 2.98732 15.2135 2.98732 15.0915 3.10935L13.5133 4.68755L15.3125 6.48673L16.8908 4.90853C17.0128 4.78649 17.0128 4.58863 16.8908 4.46659L15.5335 3.10935ZM13.9867 7.81255L12.1875 6.01338L4.32948 13.8714C4.29193 13.9089 4.26457 13.9554 4.24997 14.0066L3.55254 16.4476L5.99353 15.7501C6.04459 15.7356 6.09109 15.7082 6.12865 15.6706L13.9867 7.81255Z"
                    fill="white"
                  />
                </svg>
              </button>
            </div>
            <div className="Name">
              <p className="Username">{profileData && profileData.name}</p>
              <p className="Email">{profileData && profileData.email}</p>
              <button className="EditButtonMobile">
                Edit
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="16"
                  viewBox="0 0 15 16"
                  fill="none"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M10.0126 1.4696C10.696 0.786175 11.804 0.786178 12.4874 1.4696L13.5732 2.55539C14.2566 3.2388 14.2566 4.34684 13.5732 5.03026L4.96358 13.6399C4.75328 13.8502 4.49286 14.0034 4.2069 14.0851L0.956062 15.0139C0.694162 15.0888 0.412292 15.0157 0.219692 14.8231C0.0270925 14.6305 -0.0459506 14.3487 0.0288724 14.0868L0.957692 10.8359C1.03939 10.55 1.19262 10.2895 1.40292 10.0792L10.0126 1.4696ZM11.4268 2.53026C11.3291 2.43263 11.1708 2.43263 11.0732 2.53026L9.81063 3.79282L11.25 5.23216L12.5126 3.9696C12.6102 3.87197 12.6102 3.71368 12.5126 3.61605L11.4268 2.53026ZM10.1893 6.29282L8.75002 4.85348L2.46358 11.1399C2.43354 11.1699 2.41165 11.2071 2.39997 11.248L1.84203 13.2008L3.79482 12.6428C3.83567 12.6312 3.87287 12.6093 3.90292 12.5792L10.1893 6.29282Z"
                    fill="white"
                  />
                </svg>
              </button>
            </div>
          </div>
          <button className="EditButtonDesktop">
            Edit
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="16"
              viewBox="0 0 15 16"
              fill="none"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M10.0126 1.4696C10.696 0.786175 11.804 0.786178 12.4874 1.4696L13.5732 2.55539C14.2566 3.2388 14.2566 4.34684 13.5732 5.03026L4.96358 13.6399C4.75328 13.8502 4.49286 14.0034 4.2069 14.0851L0.956062 15.0139C0.694162 15.0888 0.412292 15.0157 0.219692 14.8231C0.0270925 14.6305 -0.0459506 14.3487 0.0288724 14.0868L0.957692 10.8359C1.03939 10.55 1.19262 10.2895 1.40292 10.0792L10.0126 1.4696ZM11.4268 2.53026C11.3291 2.43263 11.1708 2.43263 11.0732 2.53026L9.81063 3.79282L11.25 5.23216L12.5126 3.9696C12.6102 3.87197 12.6102 3.71368 12.5126 3.61605L11.4268 2.53026ZM10.1893 6.29282L8.75002 4.85348L2.46358 11.1399C2.43354 11.1699 2.41165 11.2071 2.39997 11.248L1.84203 13.2008L3.79482 12.6428C3.83567 12.6312 3.87287 12.6093 3.90292 12.5792L10.1893 6.29282Z"
                fill="white"
              />
            </svg>
          </button>
        </div>
        {/* TOOD: map through and display information */}
        <div className="InfoContainer">
          <div className="Collection">
            <div className="Item">Pronouns</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <div className="MyProfileYellowContainer">
                {profileData && profileData.pronouns[0]}
              </div>
            </div>
            <div className="Item">Allergens/Restrictions</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {profileData &&
                profileData.restrictions.map((restriction, index) => (
                  <div key={index} className="MyProfileYellowContainer">
                    {restriction}
                  </div>
                ))}
            </div>
            <div className="Item">Interests</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {profileData &&
                profileData.interests.map((interest, index) => (
                  <div key={index} className="MyProfileYellowContainer">
                    {interest}
                  </div>
                ))}
            </div>
            <div className="Item">Year</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <div className="MyProfileYellowContainer">
                {profileData && profileData.class}
              </div>
            </div>
            <div className="Item">Meal Swip Balance</div>
            <div className="MyProfileGrayContainer">165</div>
            <div className="Item">Guest Meal Swipes</div>
            <div className="MyProfileGrayContainer">13</div>
          </div>
        </div>
        <div className="BottomSection">
          <div className="PremiumContainer">
            <button className="Premium">Upgrade to Premium</button>
          </div>
        </div>
      </div>
    </div>
  );
}
