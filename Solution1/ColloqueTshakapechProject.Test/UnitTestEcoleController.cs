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
    public class UnitTestEcoleController
    {
        private Mock<LinkGenerator> _mockLinkGenerator;
        private IMapper _mapper;
        private Mock<ILogger<EcoleController>> _mockLogger;
        private Mock<IUnitOfWork> _mockUow;

        [OneTimeSetUp]
        public void Setup()
        {
            _mockLogger = new Mock<ILogger<EcoleController>>();
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
        public async Task GetOne_WhenCalledWithId_ReturnEcoleModelResult_Async()
        {
            // Arrange
            Ecoles abouElKacemElChebbie = new Ecoles
            {
                Id = 219,
                Nom = "Abou El Kacem El Chebbie",
                Telephone = "71 762 401",
                Email = "abouElKacemElChebbie-ariana@ecoles-primaire.tn",
                Adresse = "25, rue mohamed 5, cité la gazelle, ariana 2083, tunisie",
                Participants = null
            };

            _mockUow
                .Setup(r => r.GetRepository<Ecoles>().GetAsync(abouElKacemElChebbie.Id)).Returns(Task.FromResult(abouElKacemElChebbie.Clone() as Ecoles));

            var controller = new EcoleController(
                _mockLinkGenerator.Object,
                _mockLogger.Object,
                _mapper,
                _mockUow.Object);

            // Act
            var result = await controller.GetOne(abouElKacemElChebbie.Id);

            // Assert
            Assert.IsNotNull(result);
            Assert.IsAssignableFrom(typeof(ActionResult<EcoleModel>), result);

            Assert.That(result.Value, Is.EqualTo(_mapper.Map<EcoleModel>(abouElKacemElChebbie.Clone())));
        }
    }
}