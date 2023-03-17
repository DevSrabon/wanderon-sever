const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");

const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;


const app = express();

// middleware
app.use(express.json());
app.use(cors());

// Database Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sajc8ea.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1,
});

async function main() {
	try {
		const db = client.db("wanderonClone");
		const upcomingCollection = db.collection("upcoming");
		
// upcoming data with filter
		app.get("/upcoming", async (req, res) => {
			const options = req.query.option;
			let query = {};
			if (options.length) {
				query = {
					$text: {
						$search: options,
					},
				};
			}
            res.send(await upcomingCollection.find(query).toArray());
        });
        
        // backpack api
        app.get("/backpacking", async (req, res) => { 
            res.send(await upcomingCollection.find({}).toArray());
        })
// search functionality
        app.get("/searchone", async (req, res) => {
					try {
						if (req.query.pkgName) {
							let results;
							if (
								req.query.pkgName.includes(",") ||
								req.query.pkgName.includes(" ")
							) {
								results = await upcomingCollection
									.aggregate([
										{
											$search: {
												index: "autocomplete",
												autocomplete: {
													query: req.query.pkgName,
													path: "value",
													fuzzy: {
														maxEdits: 1,
													},
													tokenOrder: "sequential",
												},
											},
										},
										{
											$project: {
												value: 1,
												_id: 1,
												url: 1,
												imgTitle1: 1,
												imgTitle2: 1,
												day: 1,
												location: 1,
												pkgName: 1,
												price: 1,
												bookDate: 1,
											},
										},
										{
											$limit: 10,
										},
									])
									.toArray();

								return res.send(results);
							}

							result = await upcomingCollection
								.aggregate([
									{
										$search: {
											index: "autocomplete",
											autocomplete: {
												query: req.query.pkgName,
												path: "pkgName",
												fuzzy: {
													maxEdits: 1,
												},
												tokenOrder: "sequential",
											},
										},
									},
									{
										$project: {
											value: 1,
											_id: 1,
											url: 1,
											imgTitle1: 1,
											imgTitle2: 1,
											day: 1,
											location: 1,
											pkgName: 1,
											price: 1,
											bookDate: 1,
										},
									},
									{
										$limit: 10,
									},
								])
								.toArray();

							return res.send(result);
						}
						res.send([]);
					} catch (error) {
						console.error(error);
						res.send([]);
					}
				});
	} finally {
	}
}
main().catch((err) => console.dir(err));

app.get("/", (req, res) => {
	res.send("Server is working!");
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
