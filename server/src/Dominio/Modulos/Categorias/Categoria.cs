using NoteKeeper.Dominio.Compartilhado;
using NoteKeeper.Dominio.Modulos.Notas;

namespace NoteKeeper.Dominio.Modulos.Categorias;

public sealed class Categoria
{
    public const int TamanhoMaximoTitulo = 100;
    public const int TamanhoMinimoTitulo = 2;
    public const int TamanhoMaximoIcone = 100;

    public Guid Id { get; private set; }
    public Guid UsuarioId { get; private set; }
    public string Titulo { get; private set; } = string.Empty;
    public string Icone { get; private set; } = string.Empty;
    public string TituloNormalizado { get; private set; } = string.Empty;
    public List<NotaCategoria> NotasCategorias { get; private set; } = [];

    private Categoria() { }

    public Categoria(Guid usuarioId, string titulo, string icone)
    {
        Id = Guid.CreateVersion7();
        UsuarioId = usuarioId;
        AlterarTitulo(titulo);
        AlterarIcone(icone);
    }

    public IReadOnlyList<ErroValidacao> Validar()
    {
        if (Titulo.Length < TamanhoMinimoTitulo)
        {
            return [new("titulo", "Title must be between 2 and 100 characters.")];
        }

        if (Titulo.Length > TamanhoMaximoTitulo)
        {
            return [new("titulo", "Title must be between 2 and 100 characters.")];
        }

        if (Icone.Length == 0 || Icone.Length > TamanhoMaximoIcone)
        {
            return [new("icone", "Icon must be between 1 and 100 characters.")];
        }

        return [];
    }

    public void AlterarIcone(string icone)
    {
        Icone = icone?.Trim() ?? string.Empty;
    }

    public void AlterarTitulo(string titulo)
    {
        Titulo = titulo?.Trim() ?? string.Empty;

        TituloNormalizado = Titulo.ToUpperInvariant();
    }
}
