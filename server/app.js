const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("./config/config");
const User = require("./models/userModel");
const Event = require("./models/eventModel");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const dbURI = config.dbURI;
mongoose
  .connect(dbURI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.log(err));

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.secret,
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await User.findById(payload.userId);

      if (!user) {
        return done(null, false);
      }

      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  })
);

app.use(passport.initialize());

const authenticate = passport.authenticate("jwt", { session: false });

/******************************** USER ROUTES ********************************/

app.post("/users/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, config.secret, {
      expiresIn: "30d",
    });
    res.status(201).json({ message: "User registered successfully.", token });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/users/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ error: "Authentication failed. User not found." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ error: "Authentication failed. Incorrect password." });
    }

    const token = jwt.sign({ userId: user._id }, config.secret, {
      expiresIn: "30d",
    });

    const onboarded = user.name !== "";
    res.json({ token, onboarded });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.patch("/users/edit", authenticate, async (req, res) => {
  try {
    const {
      name,
      class: classYear,
      pronouns,
      restrictions,
      interests,
    } = req.body;
    const user = req.user;

    user.name = name;
    user.class = classYear;
    user.pronouns = pronouns;
    user.restrictions = restrictions;
    user.interests = interests;

    await user.save();

    res.json({ message: "User information updated successfully.", user });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/users/profile", authenticate, (req, res) => {
  res.json({ user: req.user });
});

/******************************* EVENT ROUTES ********************************/

app.post("/events/add", authenticate, async (req, res) => {
  try {
    const { mealType, dateTime, location, meetingLocation, type, purpose } =
      req.body;
    const user = req.user;

    const newEvent = new Event({
      mealType,
      dateTime,
      location,
      meetingLocation,
      type,
      purpose,
      host: user,
      approvedUsers: [user],
      pendingUsers: [],
    });

    await newEvent.save();

    user.events.push(newEvent._id);

    await user.save();

    res
      .status(201)
      .json({ message: "Event added successfully.", newEvent, user });
  } catch (err) {
    console.error("Error adding event:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/events", authenticate, async (req, res) => {
  try {
    const userId = req.user._id;
    const events = await Event.find();

    const hostPromises = events.map(async (event) => {
      const host = await User.findOne({ _id: event.host });
      return host ? host.name : "Unknown Host";
    });

    const classPromises = events.map(async (event) => {
      const host = await User.findOne({ _id: event.host });
      return host ? host.class : "Unknown";
    });

    const userApprovedStatusPromises = events.map(async (event) => {
      const isUserPending = event.pendingUsers.includes(userId);
      const isUserApproved = event.approvedUsers.includes(userId);
      return { isUserPending, isUserApproved };
    });

    const hostNames = await Promise.all(hostPromises);
    const hostClasses = await Promise.all(classPromises);
    const userStatuses = await Promise.all(userApprovedStatusPromises);

    const eventsWithDetails = events.map((event, index) => ({
      ...event.toObject(),
      hostName: hostNames[index],
      hostClass: hostClasses[index],
      ...userStatuses[index],
    }));

    res.json({ events: eventsWithDetails });
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/events/host", authenticate, async (req, res) => {
  try {
    const userId = req.user._id;

    const hostedEvents = await Event.find({ host: userId }).populate({
      path: "approvedUsers pendingUsers",
      select: "name email",
    });

    res.json({ hostedEvents });
  } catch (err) {
    console.error("Error fetching hosted events:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/events/join", authenticate, async (req, res) => {
  try {
    const userId = req.user._id;

    const pendingEvents = await Event.find({ pendingUsers: userId }).populate({
      path: "host",
      select: "name",
    });

    const joinedEvents = await Event.find({ approvedUsers: userId }).populate({
      path: "host",
      select: "name",
    });

    res.json({ pendingEvents, joinedEvents });
  } catch (err) {
    console.error("Error fetching joined events:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.patch("/events/edit/:id", authenticate, async (req, res) => {
  try {
    const eventId = req.params.id;
    const { mealType, dateTime, location, meetingLocation, type, purpose } =
      req.body;
    const user = req.user;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ error: "Event not found." });
    }

    if (event.host.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ error: "You are not the host of this event." });
    }

    event.mealType = mealType || event.mealType;
    event.dateTime = dateTime || event.dateTime;
    event.location = location || event.location;
    event.meetingLocation = meetingLocation || event.meetingLocation;
    event.type = type || event.type;
    event.purpose = purpose || event.purpose;

    await event.save();

    res.json({ message: "Event information updated successfully.", event });
  } catch (err) {
    console.error("Error editing event:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/events/approve/:id", authenticate, async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);
    const { userEmail } = req.body;
    const user = req.user;

    if (!event) {
      return res.status(404).json({ error: "Event not found." });
    }

    const userToApprove = await User.findOne({ email: userEmail });

    if (!userToApprove) {
      return res.status(404).json({ error: "User not found." });
    }

    if (event.host.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ error: "You are not the host of this event." });
    }

    event.pendingUsers = event.pendingUsers.filter(
      (pendingUserId) =>
        pendingUserId.toString() !== userToApprove._id.toString()
    );
    event.approvedUsers.push(userToApprove._id);

    await event.save();

    userToApprove.events.push(eventId);

    await userToApprove.save();

    res.json({
      message: "User approved for event successfully.",
      event,
      userToApprove,
    });
  } catch (err) {
    console.error("Error approving user for event:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/events/request/:id", authenticate, async (req, res) => {
  try {
    const eventId = req.params.id;
    const user = req.user;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ error: "Event not found." });
    }

    event.pendingUsers.push(user._id);

    await event.save();

    res.json({ message: "User requested to join event successfully.", event });
  } catch (err) {
    console.error("Error requesting to join event:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/events/remove/:id", authenticate, async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);
    const { userEmail } = req.body;
    const user = req.user;

    if (!event) {
      return res.status(404).json({ error: "Event not found." });
    }

    if (event.host.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ error: "You are not the host of this event." });
    }

    const userToRemove = await User.findOne({ email: userEmail });

    if (!userToRemove) {
      return res.status(404).json({ error: "User not found." });
    }

    event.approvedUsers = event.approvedUsers.filter(
      (approvedUserId) =>
        approvedUserId.toString() !== userToRemove._id.toString()
    );

    await event.save();

    userToRemove.events = userToRemove.events.filter(
      (userEventId) => userEventId.toString() !== eventId.toString()
    );

    await userToRemove.save();

    res.json({
      message: "User removed from approved users for event successfully.",
      event,
      userToRemove,
    });
  } catch (err) {
    console.error("Error removing user from approved users for event:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/events/deny/:id", authenticate, async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);
    const { userEmail } = req.body;
    const user = req.user;

    if (!event) {
      return res.status(404).json({ error: "Event not found." });
    }

    if (event.host.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ error: "You are not the host of this event." });
    }

    const userToRemove = await User.findOne({ email: userEmail });

    if (!userToRemove) {
      return res.status(404).json({ error: "User not found." });
    }

    event.pendingUsers = event.pendingUsers.filter(
      (pendingUserId) =>
        pendingUserId.toString() !== userToRemove._id.toString()
    );

    await event.save();

    res.json({
      message: "User's request denied for event successfully.",
      event,
    });
  } catch (err) {
    console.error("Error denying user's request for event:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/events/:id", authenticate, async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);
    const user = req.user;

    if (!event) {
      return res.status(404).json({ error: "Event not found." });
    }

    if (event.host.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ error: "You are not the host of this event." });
    }

    const usersWithEvent = await User.find({ events: eventId });

    for (const userToUpdate of usersWithEvent) {
      userToUpdate.events = userToUpdate.events.filter(
        (userEventId) => userEventId.toString() !== eventId.toString()
      );

      await userToUpdate.save();
    }

    await Event.findByIdAndDelete(eventId);

    res.json({ message: "Event deleted successfully." });
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/******************************** BASE ROUTE *********************************/

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Dinder's backend!" });
});

const port = config.port || 3001;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
