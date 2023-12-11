import "../styles/Hosting.css";
import Navbar from "../components/Navbar";
import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import CreateModal from "../components/CreateModal";

export default function Hosting() {
	const baseURL = "http://localhost:3001";

	const [hostedEvents, setHostedEvents] = useState([]);
	const [createModalOpen, setCreateModalOpen] = useState(false);

	useEffect(() => {
		const fetchHostingData = async () => {
			try {
				const response = await fetch(baseURL + "/events/host", {
					method: "GET",
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
						"Content-Type": "application/json",
					},
				});

				if (response.ok) {
					const data = await response.json();
					setHostedEvents(data.hostedEvents);
				} else {
					console.error("Error fetching hosted events:", response.statusText);
				}
			} catch (error) {
				console.error("Error fetching hosted events:", error.message);
			}
		};

		fetchHostingData();
	}, []);

	const denyUserRequest = async (userEmail, eventId) => {
		try {
			const response = await fetch(baseURL + "/events/deny/" + eventId, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userEmail,
				}),
			});

			if (!response.ok) {
				console.error("Error denying user:", response.statusText);
			}
		} catch (error) {
			console.error("Error making deny request:", error.message);
		}
	};

	const approveUserRequest = async (userEmail, eventId) => {
		try {
			const response = await fetch(baseURL + "/events/approve/" + eventId, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userEmail,
				}),
			});

			if (!response.ok) {
				console.error("Error approving user:", response.statusText);
			}
		} catch (error) {
			console.error("Error making approve request:", error.message);
		}
	};

	const formatDate = (dateTime) => {
		const options = { month: "short", day: "numeric" };
		return new Date(dateTime).toLocaleDateString("en-US", options);
	};

	const getHoursAndMinutesFromDate = (date) => {
		const hours = new Date(date).getHours().toString().padStart(2, "0");
		const minutes = new Date(date).getMinutes().toString().padStart(2, "0");

		return `${hours}:${minutes}`;
	};

	return (
		<div>
			<Navbar />
			<div className="Hosting">
				<div className="heading">Hosting</div>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						marginBottom: "28px",
					}}>
					<div className="sub-heading">My upcoming dinders</div>
					<div className="create" onClick={() => setCreateModalOpen(true)}>
						<div>Create</div>
						<Icon icon={"ic:round-plus"} height={18} />
					</div>
				</div>

				<div className="format-hosting">
					{hostedEvents.map((event, indexEvent) => (
						<div key={indexEvent}>
							<div
								className="event-hosting"
								style={{
									borderRadius:
										event.pendingUsers.length === 0 ? 10 : "10px 10px 0px 0px",
								}}>
								<div className="event-head-hosting">
									<div className="event-title-hours">
										<div className="event-title">
											{event.mealType} @{" "}
											{getHoursAndMinutesFromDate(event.dateTime)}
										</div>
									</div>
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
									<div style={{ fontWeight: "700" }}>
										{event.meetingLocation}
									</div>
								</div>

								{event.pendingUsers.length === 0 && (
									<div className="chat-button">
										<img src="img/chat.svg" alt="Chat" />
										<div>Chat</div>
									</div>
								)}
							</div>
							{event.pendingUsers.map((user, indexUser) => (
								<div
									key={indexUser}
									className="request-join"
									style={{
										borderRadius:
											indexUser === event.pendingUsers.length - 1
												? "0px 0px 10px 10px"
												: "0px",
									}}>
									<div>{user.name} requested to join</div>
									<div className="accept-decline-bar">
										<div
											className="accept-button"
											onClick={() => {
												approveUserRequest(user.email, event._id);
											}}>
											Accept
										</div>
										<div
											className="decline-button"
											onClick={() => {
												denyUserRequest(user.email, event._id);
											}}>
											Decline
										</div>
									</div>
								</div>
							))}
						</div>
					))}
				</div>
			</div>
			{createModalOpen ? (
				<CreateModal setCreateModalOpen={setCreateModalOpen} />
			) : null}
		</div>
	);
}
