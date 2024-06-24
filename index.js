const express = require("express");
const fetch = require("cross-fetch");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
//middleware
app.use(cors());
app.use(express.json());


async function run() {
	try {

		//==============================//
		// Whereby Video Conference Start
		//==============================//
		const meetingID = "1234";

		const API_KEY = `${process.env.WHEREBY_API_KEY}`;

		const data = {
			endDate: "2099-02-18T14:23:00.000Z",
			roomMode: "group",
			meetingId: meetingID,
			isLocked: true,
			fields: ["hostRoomUrl"],
		};

		app.get("/getMeetingData", async (req, res) => {
			try {
				const response = await fetch("https://api.whereby.dev/v1/meetings", {
					method: "POST",
					headers: {
						Authorization: `Bearer ${API_KEY}`,
						"content-type": "application/json",
					},
					body: JSON.stringify(data),
				});
				const responseData = await response.json();
				console.log(responseData)
				res.status(response.status).json(responseData);
			} catch (error) {
				console.error("Error:", error);
				res.status(500).json({ error: "Internal Server Error" });
			}
		});

		app.get("/check/meeting/:id", async (req, res) => {
			try {

				const id = req.params.id
				console.log(id);

				const response = await fetch(`https://api.whereby.dev/v1/meetings/${id}`, {
					method: "GET",
					headers: {
						Authorization: `Bearer ${API_KEY}`,
						"content-type": "application/json",
					}
				});
				const responseData = await response.json();
				console.log(responseData)
				res.status(response.status).json(responseData);
			} catch (error) {
				console.error("Error:", error);
				res.status(500).json({ error: "Internal Server Error" });
			}
		});
		//=============================//
		// Whereby Video Conference End
		//=============================//

		//===============//
		// Delete Meeting
		//===============//
		app.delete("/meetings/:id", async (req, res) => {
			const meetingId = req.params.id;
			try {
				const deleteResult = await meetingsCollection.deleteOne({
					_id: new ObjectId(meetingId),
				});

				if (deleteResult.deletedCount === 1) {
					res.status(200).send("Meeting deleted successfully");
				} else {
					res.status(404).send("Meeting not found");
				}
			} catch (error) {
				console.error("Error deleting meeting:", error);
				res.status(500).send("An error occurred while deleting the meeting");
			}
		});

	} finally {
		// await client.close();
	}
}

run().catch(console.dir);

app.get("/", (req, res) => {
	res.send("Server is running...");
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
