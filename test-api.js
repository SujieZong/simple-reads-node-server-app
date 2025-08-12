import fetch from "node-fetch";

const BASE_URL = "http://localhost:4000/api";

async function testAPI() {
  try {
    console.log("Testing SimpleReads API...\n");

    // Test health endpoint
    console.log("1. Testing health endpoint...");
    const health = await fetch(`${BASE_URL}/health`);
    const healthData = await health.json();
    console.log("Health check:", healthData);

    // Test user signup
    console.log("\n2. Testing user signup...");
    const signupResponse = await fetch(`${BASE_URL}/users/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "testuser",
        email: "test@example.com",
        password: "testpass123",
        bio: "Test user for API testing",
      }),
    });

    if (signupResponse.ok) {
      const userData = await signupResponse.json();
      console.log("User created:", userData.username);
    } else {
      const error = await signupResponse.json();
      console.log("Signup error:", error.message);
    }

    // Test get all users
    console.log("\n3. Testing get all users...");
    const usersResponse = await fetch(`${BASE_URL}/users`);
    const usersData = await usersResponse.json();
    console.log(`Found ${usersData.length} users`);

    console.log("\nAPI tests completed!");
  } catch (error) {
    console.error("Error testing API:", error);
  }
}

// Check if node-fetch is available, if not provide instructions
try {
  await testAPI();
} catch (error) {
  if (error.message.includes("node-fetch")) {
    console.log("Please install node-fetch to run API tests:");
    console.log("npm install node-fetch");
  } else {
    console.error("Error:", error.message);
  }
}
