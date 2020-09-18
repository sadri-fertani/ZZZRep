using ColloqueTshakapechProject.Test.e2e.Extensions;
using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Interactions;
using OpenQA.Selenium.Support.UI;
using System;
using System.Linq;

namespace ColloqueTshakapechProject.Test.e2e
{
    [TestFixture(Category = "e2e - Connexion")]
    public class ParticipantTest
    {
        private IWebDriver _driver;
        private WebDriverWait _wait;

        [OneTimeSetUp]
        public void Setup()
        {
            Console.WriteLine("Initialize e2e - Participant Test");

            // Initialize edge driver 
            var options = new ChromeOptions
            {
                AcceptInsecureCertificates = true,
                PageLoadStrategy = PageLoadStrategy.Normal
            };

            _driver = new ChromeDriver("./BrowserDriver/", options);
            _wait = new WebDriverWait(_driver, new TimeSpan(0, 0, 10));

            Console.WriteLine("Open Application");
            _driver.Url = "https://localhost:6001";
            Console.WriteLine("Application opened");
        }

        [Test]
        public void VerifyParticipantInscription()
        {
            Console.WriteLine("Click to subscribe to colloques");

            _driver.FindElement(By.LinkText("formulaire électronique")).Click();

            _wait.Until(d => _driver.FindElement(By.CssSelector("ul[role='tablist'] a[class='nav-link active']")));

            var tabParticipantNavigation = _driver.FindElement(By.CssSelector("ul[role='tablist'] a[class='nav-link active']"));
            if (tabParticipantNavigation == null)
            {
                Console.WriteLine("Nav link 'Participant' activated unfound");
                Assert.Fail();
            }

            Assert.AreEqual("Participant", tabParticipantNavigation.Text);
            Console.WriteLine("Nav link 'Participant' activated founded");

            Console.WriteLine("Initialize form for Participant");

            _driver.FindElement(By.CssSelector("#iNomParticipant")).SendKeys("Fertani");
            _driver.FindElement(By.CssSelector("#iPrenomParticipant")).SendKeys("Sadri");
            _driver.FindElement(By.CssSelector("#iEmailParticipant")).SendKeys("sadri.fertani@gmail.com");
            _driver.FindElement(By.CssSelector("#iTelephoneParticipant")).SendKeys("5813971456");
            _driver.SelectOptionFromSelectTag("selFonction", "Analyste");
            _driver.SelectOptionFromSelectTag("selEcole", "EPEIT");

            Console.WriteLine("Click on button Next");
            _driver.FindElement(By.CssSelector("button[class='btn btn-primary mr-1']")).Click();

            _wait.Until(d => _driver.FindElement(By.CssSelector("table[class='table table-bordered']")));

            var tabColloquesNavigation = _driver.FindElement(By.CssSelector("ul[role='tablist'] a[class='nav-link active']"));
            if (tabColloquesNavigation == null)
            {
                Console.WriteLine("Nav link 'Colloques' activated unfound");
                Assert.Fail();
            }

            Assert.AreEqual("Colloques", tabColloquesNavigation.Text);
            Console.WriteLine("Nav link 'Colloques' activated founded");

            Actions mouseHover = new Actions(_driver);
            mouseHover.MoveToElement(_driver.FindElement(By.CssSelector("table>tbody>tr:nth-child(1)>td:nth-child(2)"))).Perform();
            Assert.IsTrue(_driver.FindElement(By.CssSelector("span[class~='ng-tooltip-show']")).Displayed);


            var listCheckBoxColloques = _driver.FindElements(By.CssSelector("input[type='checkbox']"));

            if(!listCheckBoxColloques.Any())
            {
                Console.WriteLine("Aucune colloque disponible trouvée");
                Assert.Fail();
            }

            Console.WriteLine($"{listCheckBoxColloques.Count(c=>c.Enabled)} colloque(s) libre(s) trouvée(s)");

            foreach (var c in listCheckBoxColloques)
            {
                if (c.Enabled)
                {
                    Console.WriteLine("Inscription à une colloque.");
                    c.Click();
                }
            }

            Console.WriteLine("Click on button Next");
            _driver.FindElement(By.CssSelector("button[class='btn btn-primary mr-1']:nth-child(2)")).Click();

            _wait.Until(d => _driver.FindElement(By.Id("headingOne")));

            var tabResumeNavigation = _driver.FindElement(By.CssSelector("ul[role='tablist'] a[class='nav-link active']"));
            if (tabResumeNavigation == null)
            {
                Console.WriteLine("Nav link 'Résumé' activated unfound");
                Assert.Fail();
            }

            Assert.AreEqual("Résumé", tabResumeNavigation.Text);
            Console.WriteLine("Nav link 'Résumé' activated founded");

            Console.WriteLine("Click on button - Confirmation");
            _driver.FindElement(By.CssSelector("button[class='btn btn-success mr-1']")).Click();

            _wait.Until(d => _driver.FindElement(By.LinkText("formulaire électronique")));

            Assert.Pass();
            Console.WriteLine("Terminer");
        }

        [OneTimeTearDown]
        public void Cleanup()
        {
            _driver.Quit();
        }
    }
}
