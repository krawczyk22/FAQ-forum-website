
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

describe('register', () => {
	test('register one user', async done => {
		// start generating a trace file
		await page.tracing.start({path: 'trace/add_one_item_har.json',screenshots: true})
		await har.start({ path: 'trace/add_one_item_trace.har' })
		// ARRANGE
		await page.goto('http://localhost:8080/register', { timeout: 30000, waitUntil: 'load' })
		await page.goto('http://localhost:8080/register', { timeout: 30000, waitUntil: 'load' })
		// take a screenshot and save to the file system
		await page.screenshot({ path: 'screenshots/registerpage.png' })

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
		expect(heading).toBe('Log In')

		// grab a screenshot
		const image = await page.screenshot()
		// compare to the screenshot from the previous test run
		expect(image).toMatchImageSnapshot()
		// stop logging to the trace files
		//await page.tracing.stop()
		await har.stop()
		done()
	}, 16000)

	test('register one user again', async done => {
		// start generating a trace file
		//await page.tracing.start({path: 'trace/add_one_item_har.json',screenshots: true})
		await har.start({ path: 'trace/add_one_item_trace.har' })
		// ARRANGE
		await page.goto('http://localhost:8080/register', { timeout: 30000, waitUntil: 'load' })
		await page.goto('http://localhost:8080/register', { timeout: 30000, waitUntil: 'load' })
		// take a screenshot and save to the file system
		await page.screenshot({ path: 'screenshots/registerpage.png' })

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
		expect(heading).toBe('An Error Has Occurred')

		// grab a screenshot
		const image = await page.screenshot()
		// compare to the screenshot from the previous test run
		expect(image).toMatchImageSnapshot()
		// stop logging to the trace files
		//await page.tracing.stop()
		await har.stop()
		done()
	}, 16000)

	test('register one user invalid credential username', async done => {
		// start generating a trace file
		//await page.tracing.start({path: 'trace/add_one_item_har.json',screenshots: true})
		await har.start({ path: 'trace/add_one_item_trace.har' })
		// ARRANGE
		await page.goto('http://localhost:8080/register', { timeout: 30000, waitUntil: 'load' })
		await page.goto('http://localhost:8080/register', { timeout: 30000, waitUntil: 'load' })
		// take a screenshot and save to the file system
		await page.screenshot({ path: 'screenshots/registerpage.png' })

		// ACT
		// complete the form and click submit
		await page.type('input[name=user]', 'te')
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
		expect(heading).toBe('An Error Has Occurred')

		// grab a screenshot
		const image = await page.screenshot()
		// compare to the screenshot from the previous test run
		expect(image).toMatchImageSnapshot()
		// stop logging to the trace files
		//await page.tracing.stop()
		await har.stop()
		done()
	}, 16000)

	test('register one user invalid credential password', async done => {
		// start generating a trace file
		//await page.tracing.start({path: 'trace/add_one_item_har.json',screenshots: true})
		await har.start({ path: 'trace/add_one_item_trace.har' })
		// ARRANGE
		await page.goto('http://localhost:8080/register', { timeout: 30000, waitUntil: 'load' })
		await page.goto('http://localhost:8080/register', { timeout: 30000, waitUntil: 'load' })
		// take a screenshot and save to the file system
		await page.screenshot({ path: 'screenshots/registerpage.png' })

		// ACT
		// complete the form and click submit
		await page.type('input[name=user]', 'test')
		await page.type('input[name=pass]', 'te')
		await page.click('input[type=submit]')
		await page.waitForSelector('h1')
		await page.waitFor(1000) // sometimes you need a second delay

		// ASSERT

		// extracting the text inside the first H1 element on the page
		const heading = await page.evaluate( () => {
			const dom = document.querySelector('h1')
			return dom.innerText
		})
		expect(heading).toBe('An Error Has Occurred')

		// grab a screenshot
		const image = await page.screenshot()
		// compare to the screenshot from the previous test run
		expect(image).toMatchImageSnapshot()
		// stop logging to the trace files
		//await page.tracing.stop()
		await har.stop()
		done()
	}, 16000)

})

describe('login', () => {
	test('login one user', async done => {
		// start generating a trace file
		//await page.tracing.start({path: 'trace/add_login_har.json',screenshots: true})
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
		//await page.tracing.stop()
		await har.stop()
		done()
	}, 16000)

	test('login one user invalid credential username', async done => {
		// start generating a trace file
		//await page.tracing.start({path: 'trace/add_login_har.json',screenshots: true})
		await har.start({ path: 'trace/add_add_login_har_trace.har' })
		// ARRANGE
		await page.goto('http://localhost:8080/login?msg=you%20need%20to%20log%20in', { timeout: 30000, waitUntil: 'load' })
		await page.goto('http://localhost:8080/login?msg=you%20need%20to%20log%20in', { timeout: 30000, waitUntil: 'load' })
		// take a screenshot and save to the file system
		await page.screenshot({ path: 'screenshots/loginpage.png' })

		// ACT
		// complete the form and click submit
		await page.type('input[name=user]', 'test123')
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
		expect(heading).toBe('An Error Has Occurred')

		// grab a screenshot
		const image = await page.screenshot()
		// compare to the screenshot from the previous test run
		expect(image).toMatchImageSnapshot()
		// stop logging to the trace files
		//await page.tracing.stop()
		await har.stop()
		done()
	}, 16000)

	test('login one user invalid credential username length', async done => {
		// start generating a trace file
		//await page.tracing.start({path: 'trace/add_login_har.json',screenshots: true})
		await har.start({ path: 'trace/add_add_login_har_trace.har' })
		// ARRANGE
		await page.goto('http://localhost:8080/login?msg=you%20need%20to%20log%20in', { timeout: 30000, waitUntil: 'load' })
		await page.goto('http://localhost:8080/login?msg=you%20need%20to%20log%20in', { timeout: 30000, waitUntil: 'load' })
		// take a screenshot and save to the file system
		await page.screenshot({ path: 'screenshots/loginpage.png' })

		// ACT
		// complete the form and click submit
		await page.type('input[name=user]', 't')
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
		expect(heading).toBe('An Error Has Occurred')

		// grab a screenshot
		const image = await page.screenshot()
		// compare to the screenshot from the previous test run
		expect(image).toMatchImageSnapshot()
		// stop logging to the trace files
		//await page.tracing.stop()
		await har.stop()
		done()
	}, 16000)

	test('login one user invalid credential password', async done => {
		// start generating a trace file
		//await page.tracing.start({path: 'trace/add_login_har.json',screenshots: true})
		await har.start({ path: 'trace/add_add_login_har_trace.har' })
		// ARRANGE
		await page.goto('http://localhost:8080/login?msg=you%20need%20to%20log%20in', { timeout: 30000, waitUntil: 'load' })
		await page.goto('http://localhost:8080/login?msg=you%20need%20to%20log%20in', { timeout: 30000, waitUntil: 'load' })
		// take a screenshot and save to the file system
		await page.screenshot({ path: 'screenshots/loginpage.png' })

		// ACT
		// complete the form and click submit
		await page.type('input[name=user]', 'test')
		await page.type('input[name=pass]', 'testadasdadsasd')
		await page.click('input[type=submit]')
		await page.waitForSelector('h1')
		await page.waitFor(1000) // sometimes you need a second delay

		// ASSERT

		// extracting the text inside the first H1 element on the page
		const heading = await page.evaluate( () => {
			const dom = document.querySelector('h1')
			return dom.innerText
		})
		expect(heading).toBe('An Error Has Occurred')

		// grab a screenshot
		const image = await page.screenshot()
		// compare to the screenshot from the previous test run
		expect(image).toMatchImageSnapshot()
		// stop logging to the trace files
		//await page.tracing.stop()
		await har.stop()
		done()
	}, 16000)

	test('login one user invalid credential password length', async done => {
		// start generating a trace file
		//await page.tracing.start({path: 'trace/add_login_har.json',screenshots: true})
		await har.start({ path: 'trace/add_add_login_har_trace.har' })
		// ARRANGE
		await page.goto('http://localhost:8080/login?msg=you%20need%20to%20log%20in', { timeout: 30000, waitUntil: 'load' })
		await page.goto('http://localhost:8080/login?msg=you%20need%20to%20log%20in', { timeout: 30000, waitUntil: 'load' })
		// take a screenshot and save to the file system
		await page.screenshot({ path: 'screenshots/loginpage.png' })

		// ACT
		// complete the form and click submit
		await page.type('input[name=user]', 'test')
		await page.type('input[name=pass]', 'test')
		await page.click('input[type=submit]')
		await page.waitForSelector('h1')
		await page.waitFor(1000) // sometimes you need a second delay

		// ASSERT

		// extracting the text inside the first H1 element on the page
		const heading = await page.evaluate( () => {
			const dom = document.querySelector('h1')
			return dom.innerText
		})
		expect(heading).toBe('An Error Has Occurred')

		// grab a screenshot
		const image = await page.screenshot()
		// compare to the screenshot from the previous test run
		expect(image).toMatchImageSnapshot()
		// stop logging to the trace files
		//await page.tracing.stop()
		await har.stop()
		done()
	}, 16000)
})

describe('add question', () => {
	test('login one user to add question', async done => {
		// start generating a trace file
		//await page.tracing.start({path: 'trace/add_login_har.json',screenshots: true})
		await har.start({ path: 'trace/add_add_question_har_trace.har' })
		// ARRANGE
		await page.goto('http://localhost:8080/login?msg=you%20need%20to%20log%20in', { timeout: 30000, waitUntil: 'load' })
		await page.goto('http://localhost:8080/login?msg=you%20need%20to%20log%20in', { timeout: 30000, waitUntil: 'load' })
		// take a screenshot and save to the file system
		await page.screenshot({ path: 'screenshots/loginpagetoquestion.png' })

		// ACT
		// complete the form and click submit
		await page.type('input[name=user]', 'test')
		await page.type('input[name=pass]', 'testtest')
		await page.click('input[type=submit]')
		await page.waitForSelector('h1')
        await page.waitFor(1000) // sometimes you need a second delay
        
        const heading = await page.evaluate( () => {
			const dom = document.querySelector('h1')
			return dom.innerText
        })
        
		expect(heading).toBe('You are logged in. Click this to log out')
		
		await page.waitForSelector('h1')
        await page.waitFor(1000) // sometimes you need a second delay
		
		await page.screenshot({ path: 'screenshots/loginpagetoquestioninde.png' })

        await page.type('textarea[name=title]', 'sampleTitle')
		await page.type('textarea[name=description]', 'sample description')
		await page.click('input[type=submit]')
		await page.waitForSelector('h1')
		await page.waitFor(1000) // sometimes you need a second delay
        
		// ASSERT
        
        const items = await page.evaluate( () => {
			const dom = document.querySelectorAll('table tr td:first-child')
			const arr = Array.from(dom)
			return arr.map(td => td.innerText)
		})
		
		await page.screenshot({ path: 'screenshots/loginpagetoquestioninde.png' })
        
        expect(items.length).toBe(1)
        expect(items[0]).toBe('1')

		// grab a screenshot
		const image = await page.screenshot()
		// compare to the screenshot from the previous test run
		expect(image).toMatchImageSnapshot()
		// stop logging to the trace files
		//await page.tracing.stop()
		await har.stop()
		done()
	}, 16000)

	test('add one question invalid credential title', async done => {
		// start generating a trace file
		//await page.tracing.start({path: 'trace/add_login_har.json',screenshots: true})
		await har.start({ path: 'trace/add_add_question_har_trace.har' })
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
		
		await page.waitForSelector('h1')
        await page.waitFor(1000) // sometimes you need a second delay
		
		await page.screenshot({ path: 'screenshots/loginpagetoquestioninde.png' })

        await page.type('textarea[name=title]', 'sam')
		await page.type('textarea[name=description]', 'sample description')
		await page.click('input[type=submit]')
		await page.waitForSelector('h1')
		await page.waitFor(1000) // sometimes you need a second delay

		const heading2 = await page.evaluate( () => {
			const dom2 = document.querySelector('h1')
			return dom2.innerText
		})
		
		expect(heading2).toBe('An Error Has Occurred')
		// grab a screenshot
		const image = await page.screenshot()
		// compare to the screenshot from the previous test run
		expect(image).toMatchImageSnapshot()
		// stop logging to the trace files
		//await page.tracing.stop()
		await har.stop()
		done()
	}, 16000)

	test('add one question invalid credential description', async done => {
		// start generating a trace file
		//await page.tracing.start({path: 'trace/add_login_har.json',screenshots: true})
		await har.start({ path: 'trace/add_add_question_har_trace.har' })
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
		
		await page.waitForSelector('h1')
        await page.waitFor(1000) // sometimes you need a second delay
		
		await page.screenshot({ path: 'screenshots/loginpagetoquestioninde.png' })

        await page.type('textarea[name=title]', 'sampleTitle')
		await page.type('textarea[name=description]', 'sa')
		await page.click('input[type=submit]')
		await page.waitForSelector('h1')
		await page.waitFor(1000) // sometimes you need a second delay

		const heading2 = await page.evaluate( () => {
			const dom2 = document.querySelector('h1')
			return dom2.innerText
		})
		
		expect(heading2).toBe('An Error Has Occurred')
		// grab a screenshot
		const image = await page.screenshot()
		// compare to the screenshot from the previous test run
		expect(image).toMatchImageSnapshot()
		// stop logging to the trace files
		//await page.tracing.stop()
		await har.stop()
		done()
	}, 16000)

})

describe('add comment', () => {
	test('login one user to add comment', async done => {
		// start generating a trace file
		//await page.tracing.start({path: 'trace/add_login_har.json',screenshots: true})
		await har.start({ path: 'trace/add_add_comment_har_trace.har' })
		// ARRANGE
		await page.goto('http://localhost:8080/login?msg=you%20need%20to%20log%20in', { timeout: 30000, waitUntil: 'load' })
		await page.goto('http://localhost:8080/login?msg=you%20need%20to%20log%20in', { timeout: 30000, waitUntil: 'load' })
		// take a screenshot and save to the file system
		await page.screenshot({ path: 'screenshots/loginpagetoquestion.png' })

		// ACT
		// complete the form and click submit
		await page.type('input[name=user]', 'test')
		await page.type('input[name=pass]', 'testtest')
		await page.click('input[type=submit]')
		await page.waitForSelector('h1')
        await page.waitFor(1000) // sometimes you need a second delay
        
        const heading = await page.evaluate( () => {
			const dom = document.querySelector('h1')
			return dom.innerText
        })
        
		expect(heading).toBe('You are logged in. Click this to log out')
		
		await page.waitForSelector('h1')
        await page.waitFor(1000) // sometimes you need a second delay
		
		await page.screenshot({ path: 'screenshots/loginpagetoquestioninde.png' })

        await page.type('textarea[name=title]', 'sampleTitle')
		await page.type('textarea[name=description]', 'sample description')
		await page.click('input[type=submit]')
		await page.waitForSelector('h1')
		await page.waitFor(1000) // sometimes you need a second delay
        
		// ASSERT
        
        await page.goto('http://localhost:8080/question?msg=1', { timeout: 30000, waitUntil: 'load' })
		await page.goto('http://localhost:8080/question?msg=1', { timeout: 30000, waitUntil: 'load' })

		await page.screenshot({ path: 'screenshots/loginpagetoquestionpage.png' })

		await page.type('textarea[name=content]', 'samplecontent')
		await page.click('input[type=submit]')
		await page.waitForSelector('h1')
		await page.waitFor(1000) // sometimes you need a second delay
		
		const heading2 = await page.evaluate( () => {
			const dom2 = document.querySelector('h1')
			return dom2.innerText
        })
        
		expect(heading2).toBe('You are viewing a question. Click this to come back to the homepage')
		
		await page.waitForSelector('h1')
        await page.waitFor(1000) // sometimes you need a second delay

		// grab a screenshot
		const image = await page.screenshot()
		// compare to the screenshot from the previous test run
		expect(image).toMatchImageSnapshot()
		// stop logging to the trace files
		//await page.tracing.stop()
		await har.stop()
		done()
	}, 16000)

	test('login one user to add comment invalid content', async done => {
		// start generating a trace file
		//await page.tracing.start({path: 'trace/add_login_har.json',screenshots: true})
		await har.start({ path: 'trace/add_add_comment_har_trace.har' })
		// ARRANGE
		await page.goto('http://localhost:8080/login?msg=you%20need%20to%20log%20in', { timeout: 30000, waitUntil: 'load' })
		await page.goto('http://localhost:8080/login?msg=you%20need%20to%20log%20in', { timeout: 30000, waitUntil: 'load' })
		// take a screenshot and save to the file system
		await page.screenshot({ path: 'screenshots/loginpagetoquestion.png' })

		// ACT
		// complete the form and click submit
		await page.type('input[name=user]', 'test')
		await page.type('input[name=pass]', 'testtest')
		await page.click('input[type=submit]')
		await page.waitForSelector('h1')
        await page.waitFor(1000) // sometimes you need a second delay
        
        const heading = await page.evaluate( () => {
			const dom = document.querySelector('h1')
			return dom.innerText
        })
        
		expect(heading).toBe('You are logged in. Click this to log out')
		
		await page.waitForSelector('h1')
        await page.waitFor(1000) // sometimes you need a second delay
		
		await page.screenshot({ path: 'screenshots/loginpagetoquestioninde.png' })

        await page.type('textarea[name=title]', 'sampleTitle')
		await page.type('textarea[name=description]', 'sample description')
		await page.click('input[type=submit]')
		await page.waitForSelector('h1')
		await page.waitFor(1000) // sometimes you need a second delay
        
		// ASSERT
        
        await page.goto('http://localhost:8080/question?msg=1', { timeout: 30000, waitUntil: 'load' })
		await page.goto('http://localhost:8080/question?msg=1', { timeout: 30000, waitUntil: 'load' })

		await page.screenshot({ path: 'screenshots/loginpagetoquestionpage.png' })

		await page.type('textarea[name=content]', '')
		await page.click('input[type=submit]')
		await page.waitForSelector('h1')
		await page.waitFor(1000) // sometimes you need a second delay
		
		const heading2 = await page.evaluate( () => {
			const dom2 = document.querySelector('h1')
			return dom2.innerText
        })
        
		expect(heading2).toBe('An Error Has Occurred')
		
		await page.waitForSelector('h1')
        await page.waitFor(1000) // sometimes you need a second delay

		// grab a screenshot
		const image = await page.screenshot()
		// compare to the screenshot from the previous test run
		expect(image).toMatchImageSnapshot()
		// stop logging to the trace files
		//await page.tracing.stop()
		await har.stop()
		done()
	}, 16000)


})

describe('userRanking', () => {
	test('see the user ranking', async done => {
		// start generating a trace file
		//await page.tracing.start({path: 'trace/add_login_har.json',screenshots: true})
		await har.start({ path: 'trace/add_add_ranking_har_trace.har' })
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

		await page.goto('http://localhost:8080/ranking', { timeout: 30000, waitUntil: 'load' })
		await page.goto('http://localhost:8080/ranking', { timeout: 30000, waitUntil: 'load' })

		await page.screenshot({ path: 'screenshots/rankingpage.png' })

		const heading2 = await page.evaluate( () => {
			const dom2 = document.querySelector('h1')
			return dom2.innerText
		})
		expect(heading2).toBe('You are seeing the ranking of the users. Click this to come back to the homepage')

		// grab a screenshot
		const image = await page.screenshot()
		// compare to the screenshot from the previous test run
		expect(image).toMatchImageSnapshot()
		// stop logging to the trace files
		//await page.tracing.stop()
		await har.stop()
		done()
	}, 16000)

})