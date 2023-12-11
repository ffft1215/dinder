import "../styles/Joining.css";
import Navbar from "../components/Navbar";
import React, { useState, useEffect } from "react";

export default function Joining() {
	const [joinedEvents, setJoinedEvents] = useState([]);
	const [pendingEvents, setPendingEvents] = useState([]);

	const formatDate = (dateTime) => {
		const options = { month: "short", day: "numeric" };
		return new Date(dateTime).toLocaleDateString("en-US", options);
	};

	const getHoursAndMinutesFromDate = (date) => {
		const hours = new Date(date).getHours().toString().padStart(2, "0");
		const minutes = new Date(date).getMinutes().toString().padStart(2, "0");

		return `${hours}:${minutes}`;
	};

	useEffect(() => {
		const fetchEvents = async () => {
			try {
				const response = await fetch("http://localhost:3001/events/join", {
					method: "GET",
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
						"Content-Type": "application/json",
					},
				});

				if (response.ok) {
					const data = await response.json();
					setJoinedEvents(data.joinedEvents || []);
					setPendingEvents(data.pendingEvents || []);
				} else {
					console.error("Error fetching events:", response.statusText);
				}
			} catch (error) {
				console.error("Error fetching events:", error.message);
			}
		};

		fetchEvents();
	}, []);

	return (
		<div>
			<Navbar />
			<div className="Joining">
				<div className="heading">Joining</div>
				<div className="sub-heading" style={{ marginBottom: 28 }}>
					Confirmed dinders
				</div>

				<div className="format-joining">
					{joinedEvents.map((event, index) => (
						<div className="event" key={index}>
							<div className="event-head-joining">
								<div className="event-title-hours">
									<div className="event-title">
										{event.mealType} @{" "}
										{getHoursAndMinutesFromDate(event.dateTime)}
									</div>
								</div>
								<div>{event.host.name}</div>
							</div>

							<div className="event-grid">
								<div>Date </div>
								<div className="event-content">
									{formatDate(event.dateTime)}
								</div>
								<div>Type</div>
								<div className="event-content">{event.type}</div>
								<div>Location </div>
								<div className="event-content">{event.location}</div>
								<div>Purpose</div>
								<div className="event-content">{event.purpose}</div>
							</div>

							<div className="meeting-location">
								<div>Meeting Location</div>
								<div style={{ fontWeight: "700" }}>{event.meetingLocation}</div>
							</div>

							<div className="chat-button">
								<img src="img/chat.svg" alt="Chat" />
								<div>Chat</div>
							</div>
						</div>
					))}
				</div>

				<div
					className="sub-heading"
					style={{ marginBottom: 28, marginTop: 28 }}>
					Pending Requests
				</div>

				<div className="format-joining">
					{pendingEvents.map((event, index) => (
						<div className="event" key={index}>
							<div className="event-head-joining">
								<div className="event-title-hours">
									<div className="event-title">
										{event.mealType} @{" "}
										{getHoursAndMinutesFromDate(event.dateTime)}
									</div>
								</div>
								<div>{event.host.name}</div>
							</div>

							<div className="event-grid">
								<div>Date </div>
								<div className="event-content">
									{formatDate(event.dateTime)}
								</div>
								<div>Type</div>
								<div className="event-content">{event.type}</div>
								<div>Location </div>
								<div className="event-content">{event.location}</div>
								<div>Purpose</div>
								<div className="event-content">{event.purpose}</div>
							</div>

							<div className="meeting-location">
								<div>Meeting Location</div>
								<div style={{ fontWeight: "700" }}>{event.meetingLocation}</div>
							</div>

							<div className="cancel-button">Pending</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
