using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;

namespace ColloqueTshakapechProject.Test.e2e.Extensions
{
    public static class Utils
    {
        public static void SelectOptionFromSelectTag(this IWebDriver driver, string selectTagId, string textOption)
        {
            // Selection du dropdown list
            var tagSelection = driver.FindElement(By.Id(selectTagId));
            // Creation d'une instance SelectElement
            var selectElement = new SelectElement(tagSelection);
            // Select de l'option selon le texte demandé
            selectElement.SelectByText(textOption);
        }
    }
}
