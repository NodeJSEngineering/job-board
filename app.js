const puppeteer = require("puppeteer");

const mongo = require("mongodb").MongoClient

const url = "mongodb://localhost:27017"
let db, jobs

mongo.connect(
  url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err, client) => {
    if (err) {
      console.error(err)
      return
    }
    db = client.db("jobs")
    jobs = db.collection("jobs")

    // scrape(jobs)
  }
)

async function scrape(jobs){
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    await page.goto("https://remoteok.io/remote-javascript-jobs")

      /* Run javascript inside the page */
  const data = await page.evaluate(() => {
    const list = []
  const items = document.querySelectorAll("tr.job")

  for (const item of items) {
    list.push({
      company: item.querySelector(".company h3").innerHTML,
      position: item.querySelector(".company h2").innerHTML,
      link: "https://remoteok.io" + item.getAttribute("data-href"),
    })
  }

  return list
  })

  console.log(data)
  jobs.deleteMany({})
  jobs.insertMany(data)
  await browser.close()
}
async function scrape2(jobs){
  const searchQuery = "angular";

  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  await page.goto("https://remoteok.io/", {waitUntil: "domcontentloaded"});
  await page.waitForSelector('body > div.top > div.box > input', {visible: true});
  await page.type('body > div.top > div.box > input', searchQuery);
  // await Promise.all([
  //  await page.waitForNavigation(),
    page.keyboard.press("Enter"),
  // ]);
    await page.waitForSelector("#jobsboard", {visible: true});
  const searchResults = await page.$$eval(".job", els => 
    // els.map(e => ({title: e}))
console.log(els)

  );
// console.log(searchResults)
// jobs.deleteMany({})
// jobs.insertMany(data)
// await browser.close()
}

scrape2('')