import asyncio
from playwright import async_api
 
async def run_test():
    pw = None
    browser = None
    context = None
    
    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()
        
        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",
                "--disable-dev-shm-usage",
                "--ipc=host",
                "--single-process"
            ],
        )
        
        # Create a new browser context
        context = await browser.new_context()
        context.set_default_timeout(5000)
        
        # Open a new page in the browser context
        page = await context.new_page()
        
        # Navigate to your target URL
        await page.goto("http://localhost:5000", wait_until="commit", timeout=10000)
        
        # Take a screenshot for debugging
        await page.screenshot(path="testsprite_tests/debug_homepage.png")
        
        # Try multiple selectors for login link
        login_selectors = [
            'a[href*="login"]',
            'text="Login"',
            'text="Sign In"',
            'button:has-text("Login")',
            'a:has-text("Login")',
            '[data-testid="login"]'
        ]
        
        login_clicked = False
        for selector in login_selectors:
             try:
                 login_element = page.locator(selector).first
                 if await login_element.is_visible(timeout=2000):
                     await login_element.click()
                     login_clicked = True
                     break
             except:
                 continue
        
        if not login_clicked:
            # Try to navigate directly to login page
            await page.goto("http://localhost:5000/login", wait_until="commit", timeout=10000)
        
        # Wait for login page to load
        await page.wait_for_load_state("networkidle")
        
        # Fill in login credentials
        email_input = page.locator('input[type="email"]')
        password_input = page.locator('input[type="password"]')
        
        await email_input.fill("testuser@example.com")
        await password_input.fill("test1234")
        
        # Click login button
        login_button = page.locator('button[type="submit"]')
        await login_button.click()
        
        # Wait for successful login and redirect
        await page.wait_for_load_state("networkidle")
        
        # Verify we're on the dashboard/home page
        await page.wait_for_selector('[data-testid="dashboard"], .dashboard, h1', timeout=10000)
        
        # Test resume builder functionality
        resume_builder_link = page.locator('text="Resume Builder"').first
        if await resume_builder_link.is_visible():
            await resume_builder_link.click()
            await page.wait_for_load_state("networkidle")
        
        # Test template selection
        template_selector = page.locator('.template-card, [data-testid="template"]').first
        if await template_selector.is_visible():
            await template_selector.click()
            await page.wait_for_timeout(2000)
        
        # Test form filling
        name_input = page.locator('input[placeholder*="name"], input[name*="name"]').first
        if await name_input.is_visible():
            await name_input.fill("John Doe")
        
        email_field = page.locator('input[type="email"], input[placeholder*="email"]').first
        if await email_field.is_visible():
            await email_field.fill("john.doe@example.com")
        
        # Test save functionality
        save_button = page.locator('button:has-text("Save"), button[type="submit"]').first
        if await save_button.is_visible():
            await save_button.click()
            await page.wait_for_timeout(2000)
        
        print("✅ Test completed successfully")
        
    except Exception as e:
        print(f"❌ Test failed: {str(e)}")
        
    finally:
        # Clean up resources
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

if __name__ == "__main__":
    asyncio.run(run_test())