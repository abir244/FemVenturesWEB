const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// signup.js

// Function to handle form submission
document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signupForm");

    if (signupForm) {
        signupForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const formData = new FormData(signupForm);
            const userData = {
                username: formData.get("username"),
                email: formData.get("email"),
                password: formData.get("password"),
            };

            try {
                const response = await fetch("/api/signup", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(userData),
                });

                if (response.ok) {
                    alert("Signup successful!");
                    window.location.href = "/login.html";
                } else {
                    const errorData = await response.json();
                    alert(`Signup failed: ${errorData.message}`);
                }
            } catch (error) {
                console.error("Error during signup:", error);
                alert("An error occurred. Please try again later.");
            }
        });
    }
});
// Example server-side code to handle signup and save data to a database

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/ecommerce", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define a User schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Create a User model
const User = mongoose.model("User", userSchema);

// API endpoint to handle signup
app.post("/api/signup", async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Create a new user and save to the database
        const newUser = new User({ username, email, password });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error saving user:", error);
        res.status(500).json({ message: "Failed to register user" });
    }
});

// Start the server
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});