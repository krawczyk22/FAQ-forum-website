'use strict'

const puppeteer = require('puppeteer')
const { configureToMatchImageSnapshot } = require('jest-image-snapshot')
const PuppeteerHar = require('puppeteer-har')

const width = 800
const height = 600
const delayMS = 5

let browser
let page
let har

// threshold is the difference in pixels before the snapshots dont match
const toMatchImageSnapshot = configureToMatchImageSnapshot({
	customDiffConfig: { threshold: 2 },
	noColors: true,
})
expect.extend({ toMatchImageSnapshot })

beforeAll( async() => {
	browser = await puppeteer.launch({ headless: true, slowMo: delayMS, args: [`--window-size=${width},${height}`] })
	page = await browser.newPage()
	har = new PuppeteerHar(page)
	await page.setViewport({ width, height })
})

afterAll( () => browser.close() ) // https://github.com/GoogleChrome/puppeteer/issues/561

describe('login', () => {
	test('login one user', async done => {
		// start generating a trace file
		await page.tracing.start({path: 'trace/add_login_har.json',screenshots: true})
		await har.start({ path: 'trace/add_add_login_har_trace.har' })
		// ARRANGE
		await page.goto('http://localhost:8080/login?msg=you%20need%20to%20log%20in', { timeout: 30000, waitUntil: 'load' })
		await page.goto('http://localhost:8080/login?msg=you%20need%20to%20log%20in', { timeout: 30000, waitUntil: 'load' })
		// take a screenshot and save to the file system
		await page.screenshot({ path: 'screenshots/loginpage.png' })

		// ACT
		// complete the form and click submit
		await page.type('input[name=user]', 'test')
		await page.type('input[name=pass]', 'testtest')
		await page.click('input[type=submit]')
		await page.waitForSelector('h1')
		await page.waitFor(1000) // sometimes you need a second delay

		// ASSERT

		// extracting the text inside the first H1 element on the page
		const heading = await page.evaluate( () => {
			const dom = document.querySelector('h1')
			return dom.innerText
		})
		expect(heading).toBe('You are logged in. Click this to log out')

		// grab a screenshot
		const image = await page.screenshot()
		// compare to the screenshot from the previous test run
		expect(image).toMatchImageSnapshot()
		// stop logging to the trace files
		await page.tracing.stop()
		await har.stop()
		done()
	}, 16000)
})