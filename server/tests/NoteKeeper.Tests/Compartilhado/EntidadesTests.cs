using NoteKeeper.Dominio.Modulos.Categorias;
using NoteKeeper.Dominio.Modulos.Notas;
using Xunit;

namespace NoteKeeper.Tests.Compartilhado;

public sealed class EntidadesTests
{
    [Fact]
    public void Categoria_AplicaTrimEValidacaoDeTitulo()
    {
        // Arrange
        var usuarioId = Guid.NewGuid();

        // Act
        var categoria = new Categoria(usuarioId, "  Trabalho  ", "bi bi-tag");

        // Assert
        Assert.Equal("Trabalho", categoria.Titulo);
        Assert.Equal("TRABALHO", categoria.TituloNormalizado);
        Assert.Empty(categoria.Validar());
    }

    [Theory]
    [InlineData("")]
    [InlineData("A")]
    public void Categoria_RejeitaTituloCurto(string titulo)
    {
        // Arrange
        var usuarioId = Guid.NewGuid();

        // Act
        var categoria = new Categoria(usuarioId, titulo, "bi bi-tag");

        // Assert
        Assert.NotEmpty(categoria.Validar());
    }

    [Fact]
    public void Nota_PermiteDescricaoVaziaENotaSemCategorias()
    {
        // Arrange
        var usuarioId = Guid.NewGuid();

        // Act
        var nota = new Nota(usuarioId, "Ideia", null, StatusNota.Ativa);

        // Assert
        Assert.Empty(nota.Validar());
        Assert.Empty(nota.NotasCategorias);
    }

    [Fact]
    public void Nota_RejeitaDescricaoMaiorQueTrezentosCaracteres()
    {
        // Arrange
        var usuarioId = Guid.NewGuid();
        var descricao = new string('a', 301);

        // Act
        var nota = new Nota(usuarioId, "Ideia", descricao, StatusNota.Ativa);

        // Assert
        Assert.Contains(nota.Validar(), erro => erro.Campo == "descricao");
    }

    [Fact]
    public void Nota_NormalizaTituloSemDistinguirCaixa()
    {
        // Arrange
        var usuarioId = Guid.NewGuid();

        // Act
        var nota = new Nota(usuarioId, "  Minha Nota ", null, StatusNota.Arquivada);

        // Assert
        Assert.Equal("Minha Nota", nota.Titulo);
        Assert.Equal("MINHA NOTA", nota.TituloNormalizado);
    }

    [Fact]
    public void Categoria_AplicaTrimAoIconeEPermiteAlteracao()
    {
        // Arrange
        var categoria = new Categoria(Guid.NewGuid(), "Trabalho", "  bi bi-tag  ");
        Assert.Equal("bi bi-tag", categoria.Icone);

        // Act
        categoria.AlterarIcone("  bi bi-person  ");

        // Assert
        Assert.Equal("bi bi-person", categoria.Icone);
        Assert.Empty(categoria.Validar());
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public void Categoria_RejeitaIconeVazio(string? icone)
    {
        // Arrange
        var usuarioId = Guid.NewGuid();

        // Act
        var categoria = new Categoria(usuarioId, "Trabalho", icone!);

        // Assert
        Assert.Contains(categoria.Validar(), erro => erro.Campo == "icone");
    }

    [Theory]
    [InlineData(100, true)]
    [InlineData(101, false)]
    public void Categoria_ValidaLimiteDoIcone(int tamanho, bool valido)
    {
        // Arrange
        var icone = new string('a', tamanho);

        // Act
        var categoria = new Categoria(Guid.NewGuid(), "Trabalho", icone);

        // Assert
        Assert.Equal(valido, categoria.Validar().Count == 0);
    }

}
