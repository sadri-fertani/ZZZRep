using AutoMapper;
using ColloqueTshakapeshProject.Controllers.Administrator;
using ColloqueTshakapeshProject.Data;
using ColloqueTshakapeshProject.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Logging;
using Moq;
using NUnit.Framework;
using System.Threading.Tasks;

namespace ColloqueTshakapechProject.Test
{
    public class UnitTestFonctionController
    {
        private Mock<LinkGenerator> _mockLinkGenerator;
        private IMapper _mapper;
        private Mock<ILogger<FonctionController>> _mockLogger;
        private Mock<IUnitOfWork> _mockUow;

        [OneTimeSetUp]
        public void Setup()
        {
            _mockLogger = new Mock<ILogger<FonctionController>>();
            _mockUow = new Mock<IUnitOfWork>();

            // Auto mapper configuration
            var mockMapper = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile(new ApplicationProfile());
            });

            _mapper = mockMapper.CreateMapper();

            // LinkGenerator
            _mockLinkGenerator = new Mock<LinkGenerator>();

            _mockLinkGenerator
                .Setup(
                    g => g.GetPathByAddress(
                        It.IsAny<HttpContext>(),
                        It.IsAny<RouteValuesAddress>(), 
                        It.IsAny<RouteValueDictionary>(),
                        It.IsAny<RouteValueDictionary>(), 
                        It.IsAny<PathString?>(),
                        It.IsAny<FragmentString>(), 
                        It.IsAny<LinkOptions>()
                        )
                )
                .Returns("/");
        }

        [Test]
        public async Task GetOne_WhenCalledWithId_ReturnFonctionModelResult_Async()
        {
            // Arrange
            Fonctions etudiant = new Fonctions
            {
                Id = 5,
                Nom = "Etudiant"
            };

            _mockUow
                .Setup(r => r.GetRepository<Fonctions>().GetAsync(etudiant.Id)).Returns(Task.FromResult(etudiant));

            var controller = new FonctionController(
                _mockLogger.Object,
                _mapper,
                _mockUow.Object,
                _mockLinkGenerator.Object);

            // Act
            var result = await controller.GetOne(etudiant.Id);

            // Assert
            Assert.IsNotNull(result);
            Assert.IsAssignableFrom(typeof(ActionResult<FonctionModel>), result);

            Assert.That(result.Value.Nom, Is.EqualTo((_mapper.Map<FonctionModel>(etudiant).Nom)));
        }
    }
}