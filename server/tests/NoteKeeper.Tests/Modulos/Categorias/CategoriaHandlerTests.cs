using Moq;
using NoteKeeper.Aplicacao.Modulos.Categorias;
using NoteKeeper.Dominio.Modulos.Categorias;
using Xunit;

namespace NoteKeeper.Tests.Modulos.Categorias;

public sealed class CategoriaHandlerTests
{
    [Fact]
    public async Task CriarCategoria_ComTituloValido_SalvaECriaDto()
    {
        // Arrange
        var repositorio = new Mock<IRepositorioCategoria>();
        var usuarioId = Guid.NewGuid();
        repositorio
            .Setup(x => x.TituloExisteAsync(usuarioId, "TRABALHO", null, It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);
        repositorio
            .Setup(x => x.SalvarAsync(It.IsAny<Categoria>(), It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);
        var handler = new CriarCategoriaCommandHandler(repositorio.Object);

        // Act
        var result = await handler.Handle(
            new CriarCategoriaCommand(usuarioId, "  Trabalho  ", "  bi bi-tag  "),
            CancellationToken.None);

        // Assert
        Assert.True(result.IsSuccess);
        Assert.Equal("Trabalho", result.Value.Titulo);
        Assert.Equal("bi bi-tag", result.Value.Icone);
        repositorio.Verify(
            x => x.SalvarAsync(
                It.Is<Categoria>(categoria => categoria.Titulo == "Trabalho" && categoria.UsuarioId == usuarioId && categoria.Icone == "bi bi-tag"),
                It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task CriarCategoria_ComTituloInvalido_RetornaFalhaSemConsultarDuplicidade()
    {
        // Arrange
        var repositorio = new Mock<IRepositorioCategoria>();
        var handler = new CriarCategoriaCommandHandler(repositorio.Object);

        // Act
        var result = await handler.Handle(
            new CriarCategoriaCommand(Guid.NewGuid(), "A", "bi bi-tag"),
            CancellationToken.None);

        // Assert
        Assert.True(result.IsFailed);
        repositorio.Verify(
            x => x.TituloExisteAsync(
                It.IsAny<Guid>(),
                It.IsAny<string>(),
                It.IsAny<Guid?>(),
                It.IsAny<CancellationToken>()),
            Times.Never);
    }

    [Fact]
    public async Task CriarCategoria_ComTituloDuplicado_RetornaConflitoSemSalvar()
    {
        // Arrange
        var repositorio = new Mock<IRepositorioCategoria>();
        var usuarioId = Guid.NewGuid();
        repositorio
            .Setup(x => x.TituloExisteAsync(usuarioId, "TRABALHO", null, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);
        var handler = new CriarCategoriaCommandHandler(repositorio.Object);

        // Act
        var result = await handler.Handle(
            new CriarCategoriaCommand(usuarioId, "Trabalho", "bi bi-tag"),
            CancellationToken.None);

        // Assert
        Assert.True(result.IsFailed);
        repositorio.Verify(
            x => x.SalvarAsync(It.IsAny<Categoria>(), It.IsAny<CancellationToken>()),
            Times.Never);
    }

    [Fact]
    public async Task ListarCategorias_RetornaDtoDasCategoriasDoUsuario()
    {
        // Arrange
        var usuarioId = Guid.NewGuid();
        IReadOnlyList<Categoria> categorias = new[]
        {
            new Categoria(usuarioId, "Trabalho", "bi bi-tag"),
            new Categoria(usuarioId, "Pessoal", "bi bi-person")
        };
        var repositorio = new Mock<IRepositorioCategoria>();
        repositorio
            .Setup(x => x.ListarAsync(usuarioId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(categorias);
        var handler = new ListarCategoriasQueryHandler(repositorio.Object);

        // Act
        var result = await handler.Handle(new ListarCategoriasQuery(usuarioId), CancellationToken.None);

        // Assert
        Assert.True(result.IsSuccess);
        Assert.Equal(2, result.Value.Count);
        Assert.Contains(result.Value, categoria => categoria.Titulo == "Pessoal" && categoria.Icone == "bi bi-person");
    }

    [Fact]
    public async Task ObterCategoria_QuandoNaoExiste_RetornaFalha()
    {
        // Arrange
        var repositorio = new Mock<IRepositorioCategoria>();
        repositorio
            .Setup(x => x.ObterAsync(It.IsAny<Guid>(), It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Categoria?)null);
        var handler = new ObterCategoriaQueryHandler(repositorio.Object);

        // Act
        var result = await handler.Handle(
            new ObterCategoriaQuery(Guid.NewGuid(), Guid.NewGuid()),
            CancellationToken.None);

        // Assert
        Assert.True(result.IsFailed);
    }

    [Fact]
    public async Task ObterCategoria_QuandoExiste_RetornaDto()
    {
        // Arrange
        var usuarioId = Guid.NewGuid();
        var categoria = new Categoria(usuarioId, "Trabalho", "bi bi-tag");
        var repositorio = new Mock<IRepositorioCategoria>();
        repositorio
            .Setup(x => x.ObterAsync(categoria.Id, usuarioId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(categoria);
        var handler = new ObterCategoriaQueryHandler(repositorio.Object);

        // Act
        var result = await handler.Handle(
            new ObterCategoriaQuery(usuarioId, categoria.Id),
            CancellationToken.None);

        // Assert
        Assert.True(result.IsSuccess);
        Assert.Equal(categoria.Id, result.Value.Id);
        Assert.Equal(categoria.Titulo, result.Value.Titulo);
        Assert.Equal(categoria.Icone, result.Value.Icone);
    }

    [Fact]
    public async Task AtualizarCategoria_ComTituloDuplicado_RetornaFalhaSemSalvar()
    {
        // Arrange
        var usuarioId = Guid.NewGuid();
        var categoria = new Categoria(usuarioId, "Trabalho", "bi bi-tag");
        var repositorio = new Mock<IRepositorioCategoria>();
        repositorio
            .Setup(x => x.ObterAsync(categoria.Id, usuarioId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(categoria);
        repositorio
            .Setup(x => x.TituloExisteAsync(usuarioId, "PESSOAL", categoria.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);
        var handler = new AtualizarCategoriaCommandHandler(repositorio.Object);

        // Act
        var result = await handler.Handle(
            new AtualizarCategoriaCommand(usuarioId, categoria.Id, "Pessoal", "  bi bi-person  "),
            CancellationToken.None);

        // Assert
        Assert.True(result.IsFailed);
        repositorio.Verify(
            x => x.SalvarAsync(It.IsAny<Categoria>(), It.IsAny<CancellationToken>()),
            Times.Never);
    }

    [Fact]
    public async Task AtualizarCategoria_ComTituloValido_SalvaCategoria()
    {
        // Arrange
        var usuarioId = Guid.NewGuid();
        var categoria = new Categoria(usuarioId, "Trabalho", "bi bi-tag");
        var repositorio = new Mock<IRepositorioCategoria>();
        repositorio
            .Setup(x => x.ObterAsync(categoria.Id, usuarioId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(categoria);
        repositorio
            .Setup(x => x.TituloExisteAsync(usuarioId, "PESSOAL", categoria.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);
        repositorio
            .Setup(x => x.SalvarAsync(categoria, It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);
        var handler = new AtualizarCategoriaCommandHandler(repositorio.Object);

        // Act
        var result = await handler.Handle(
            new AtualizarCategoriaCommand(usuarioId, categoria.Id, "Pessoal", "  bi bi-person  "),
            CancellationToken.None);

        // Assert
        Assert.True(result.IsSuccess);
        Assert.Equal("Pessoal", result.Value.Titulo);
        Assert.Equal("bi bi-person", result.Value.Icone);
        Assert.Equal("bi bi-person", categoria.Icone);
        repositorio.Verify(x => x.SalvarAsync(categoria, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task ExcluirCategoria_QuandoExiste_ExcluiERetornaSucesso()
    {
        // Arrange
        var usuarioId = Guid.NewGuid();
        var categoria = new Categoria(usuarioId, "Trabalho", "bi bi-tag");
        var repositorio = new Mock<IRepositorioCategoria>();
        repositorio
            .Setup(x => x.ObterAsync(categoria.Id, usuarioId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(categoria);
        repositorio
            .Setup(x => x.ExcluirAsync(categoria, It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);
        var handler = new ExcluirCategoriaCommandHandler(repositorio.Object);

        // Act
        var result = await handler.Handle(
            new ExcluirCategoriaCommand(usuarioId, categoria.Id),
            CancellationToken.None);

        // Assert
        Assert.True(result.IsSuccess);
        repositorio.Verify(x => x.ExcluirAsync(categoria, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task ExcluirCategoria_QuandoNaoExiste_RetornaFalha()
    {
        // Arrange
        var repositorio = new Mock<IRepositorioCategoria>();
        repositorio
            .Setup(x => x.ObterAsync(It.IsAny<Guid>(), It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Categoria?)null);
        var handler = new ExcluirCategoriaCommandHandler(repositorio.Object);

        // Act
        var result = await handler.Handle(
            new ExcluirCategoriaCommand(Guid.NewGuid(), Guid.NewGuid()),
            CancellationToken.None);

        // Assert
        Assert.True(result.IsFailed);
        repositorio.Verify(x => x.ExcluirAsync(It.IsAny<Categoria>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData(101)]
    public async Task CriarCategoria_ComIconeInvalido_RetornaFalhaSemSalvar(object? valor)
    {
        // Arrange
        var icone = valor is int tamanho ? new string('a', tamanho) : valor as string;
        var repositorio = new Mock<IRepositorioCategoria>();
        var handler = new CriarCategoriaCommandHandler(repositorio.Object);

        // Act
        var result = await handler.Handle(
            new CriarCategoriaCommand(Guid.NewGuid(), "Trabalho", icone),
            CancellationToken.None);

        // Assert
        Assert.True(result.IsFailed);
        Assert.Contains(result.Errors, erro => erro.Metadata["Campo"].ToString() == "icone");
        repositorio.VerifyNoOtherCalls();
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData(101)]
    public async Task AtualizarCategoria_ComIconeInvalido_RetornaFalhaSemSalvar(object? valor)
    {
        // Arrange
        var icone = valor is int tamanho ? new string('a', tamanho) : valor as string;
        var usuarioId = Guid.NewGuid();
        var categoria = new Categoria(usuarioId, "Trabalho", "bi bi-tag");
        var repositorio = new Mock<IRepositorioCategoria>();
        repositorio
            .Setup(x => x.ObterAsync(categoria.Id, usuarioId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(categoria);
        var handler = new AtualizarCategoriaCommandHandler(repositorio.Object);

        // Act
        var result = await handler.Handle(
            new AtualizarCategoriaCommand(usuarioId, categoria.Id, "Trabalho", icone),
            CancellationToken.None);

        // Assert
        Assert.True(result.IsFailed);
        Assert.Contains(result.Errors, erro => erro.Metadata["Campo"].ToString() == "icone");
        repositorio.Verify(
            x => x.SalvarAsync(It.IsAny<Categoria>(), It.IsAny<CancellationToken>()),
            Times.Never);
    }

}
