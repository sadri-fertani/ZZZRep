using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using System;

namespace ColloqueTshakapechProject.Test.e2e
{
    [TestFixture(Category = "e2e - Connexion")]
    public class AdministratorTest
    {
        private IWebDriver _driver;

        [OneTimeSetUp]
        public void Setup()
        {
            Console.WriteLine("Initialize e2e - Administrateur Test");

            // Initialize edge driver 
            var options = new ChromeOptions
            {
                AcceptInsecureCertificates = true,
                PageLoadStrategy = PageLoadStrategy.Normal
            };

            _driver = new ChromeDriver("./BrowserDriver/", options);

            Console.WriteLine("Open Application");
            _driver.Url = "https://localhost:5001";
            Console.WriteLine("Application opened");
        }

        [Test]
        public void VerifyLogin()
        {
            Console.WriteLine("Click on login link");

            _driver.FindElement(By.CssSelector("a[href ='/authentication/login']")).Click();

            WaitInSecondes(10);

            Console.WriteLine("Form initialize");

            _driver.FindElement(By.CssSelector("#Input_Email")).SendKeys("eeeeeeeee@dfgdgdfgdfgdfg");
            _driver.FindElement(By.CssSelector("#Input_Password")).SendKeys("5zcEFG2rXs!W&*H");
            Console.WriteLine("Form submit");
            _driver.FindElement(By.CssSelector("button[type='submit']")).Click();
            Console.WriteLine("Form submited");
            WaitInSecondes(10);

            var linkLogOut = _driver.FindElement(By.CssSelector("a[href ='/authentication/logout']"));

            if (linkLogOut == null)
            {
                Console.WriteLine("Link logout unfound");
                Assert.Fail();
            }

            Console.WriteLine("Link logout founded");

            Assert.AreEqual("Se déconnecter", linkLogOut.Text);
        }

        [OneTimeTearDown]
        public void Cleanup()
        {
            _driver.Quit();
        }

        private void WaitInSecondes(int secondes)
        {
            _driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(secondes);
        }
    }
}
