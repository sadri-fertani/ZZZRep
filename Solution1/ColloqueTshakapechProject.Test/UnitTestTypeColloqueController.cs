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
    public class UnitTestTypeColloqueController
    {
        private Mock<LinkGenerator> _mockLinkGenerator;
        private IMapper _mapper;
        private Mock<ILogger<TypeColloqueController>> _mockLogger;
        private Mock<IUnitOfWork> _mockUow;

        [OneTimeSetUp]
        public void Setup()
        {
            _mockLogger = new Mock<ILogger<TypeColloqueController>>();
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
        public async Task GetOne_WhenCalledWithId_ReturnTypeColloqueModelResult_Async()
        {
            // Arrange
            TypeColloque typeColloque = new TypeColloque
            {
                Id = 3,
                Nom = "Conférence"
            };

            _mockUow
                .Setup(r => r.GetRepository<TypeColloque>().GetAsync(typeColloque.Id)).Returns(Task.FromResult(typeColloque));

            var controller = new TypeColloqueController(
                _mockLinkGenerator.Object,
                _mockLogger.Object,
                _mapper,
                _mockUow.Object
                );

            // Act
            var result = await controller.GetOne(typeColloque.Id);

            // Assert
            Assert.IsNotNull(result);
            Assert.IsAssignableFrom(typeof(ActionResult<TypeColloqueModel>), result);

            Assert.That(result.Value.Nom, Is.EqualTo((_mapper.Map<TypeColloqueModel>(typeColloque).Nom)));
        }
    }
}